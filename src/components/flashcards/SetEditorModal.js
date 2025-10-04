import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Palette,
  Tag,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";
import { supabase } from "../../services/supabase";
import { useDrafts } from "../../contexts/DraftContext";

const SetEditorModal = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { sets, createSet, updateSet } = useFlashcards();
  const { saveDraft, getDraft, clearDraft } = useDrafts();

  const isNewSet = setId === "new";
  const existingSet = isNewSet ? null : sets.find((set) => set.id === setId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [cards, setCards] = useState([
    {
      front: "",
      back: "",
      front_image_url: "",
      back_image_url: "",
      tags: [],
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [showDraftNotice, setShowDraftNotice] = useState(false);

  const [isOwner, setIsOwner] = useState(true);
  const [userPermission, setUserPermission] = useState("edit");
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const hasLoadedInitialData = useRef(false);
  const autoSaveTimer = useRef(null);

  const availableColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
  ];

  const availableTags = [
    "Noun",
    "Verb",
    "Adjective",
    "Adverb",
    "Grammar",
    "Phrase",
    "Idiom",
    "Pronunciation",
    "Formal",
    "Informal",
  ];

  useEffect(() => {
    const checkPermissions = async () => {
      if (isNewSet) {
        setIsOwner(true);
        setUserPermission("edit");
        setIsLoadingPermissions(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/dashboard/flashcards");
          return;
        }

        // Check ownership from context first
        const userIsOwner = existingSet?.isOwner !== false;
        setIsOwner(userIsOwner);

        if (userIsOwner) {
          setUserPermission("edit");
        } else {
          // It's a shared set, get permission from context or check database
          const contextPermission = existingSet?.permission;

          if (contextPermission) {
            setUserPermission(contextPermission);
            if (contextPermission === "view") {
              alert("Bạn chỉ có quyền xem bộ thẻ này. Không thể chỉnh sửa.");
            }
          } else {
            // Fallback to database check
            const { data: shareData, error } = await supabase
              .from("flashcard_set_shares")
              .select("permission")
              .eq("set_id", setId)
              .or(
                `shared_with_user_id.eq.${user.id},shared_with_email.eq.${user.email}`
              )
              .maybeSingle();

            if (error || !shareData) {
              alert("Bạn không có quyền truy cập bộ thẻ này");
              navigate("/dashboard/flashcards");
              return;
            }

            setUserPermission(shareData.permission);
            if (shareData.permission === "view") {
              alert("Bạn chỉ có quyền xem bộ thẻ này. Không thể chỉnh sửa.");
            }
          }
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        navigate("/dashboard/flashcards");
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    checkPermissions();
  }, [setId, existingSet, isNewSet, navigate]);

  useEffect(() => {
    if (hasLoadedInitialData.current || isLoadingPermissions) return;

    const draft = getDraft(setId);

    if (existingSet) {
      const baseTitle = existingSet.title;
      const baseDescription = existingSet.description;
      const baseColor = existingSet.color || "#3B82F6";
      const baseCards = existingSet.cards?.length
        ? existingSet.cards.map((card) => ({
            ...card,
            front_image_url: card.front_image_url || "",
            back_image_url: card.back_image_url || "",
            tags: card.tags || [],
          }))
        : [
            {
              front: "",
              back: "",
              front_image_url: "",
              back_image_url: "",
              tags: [],
            },
          ];

      if (draft && userPermission === "edit") {
        setTitle(draft.title);
        setDescription(draft.description);
        setColor(draft.color);
        setCards(draft.cards);
        setShowDraftNotice(true);
        setTimeout(() => setShowDraftNotice(false), 5000);
      } else {
        setTitle(baseTitle);
        setDescription(baseDescription);
        setColor(baseColor);
        setCards(baseCards);
      }
    } else if (isNewSet) {
      if (draft) {
        setTitle(draft.title);
        setDescription(draft.description);
        setColor(draft.color);
        setCards(draft.cards);
        setShowDraftNotice(true);
        setTimeout(() => setShowDraftNotice(false), 5000);
      }
    }

    hasLoadedInitialData.current = true;
  }, [
    setId,
    existingSet,
    isNewSet,
    getDraft,
    isLoadingPermissions,
    userPermission,
  ]);

  useEffect(() => {
    if (!hasLoadedInitialData.current || userPermission !== "edit") return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      saveDraft(setId, {
        title,
        description,
        color,
        cards,
      });
    }, 1000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [title, description, color, cards, setId, saveDraft, userPermission]);

  const uploadImageToSupabase = async (file, cardId, side) => {
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${cardId}-${side}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("flashcard-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("flashcard-images").getPublicUrl(fileName);

    return publicUrl;
  };

  const deleteImageFromSupabase = async (imageUrl) => {
    try {
      if (!imageUrl || !imageUrl.includes("supabase")) {
        return;
      }

      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from("flashcard-images")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const addCard = () => {
    if (userPermission !== "edit") return;

    setCards([
      ...cards,
      {
        front: "",
        back: "",
        front_image_url: "",
        back_image_url: "",
        tags: [],
      },
    ]);
  };

  const updateCard = (index, field, value) => {
    if (userPermission !== "edit") return;

    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const deleteCard = async (index) => {
    if (userPermission !== "edit") return;

    if (cards.length > 1) {
      const card = cards[index];

      if (card.front_image_url) {
        await deleteImageFromSupabase(card.front_image_url);
      }
      if (card.back_image_url) {
        await deleteImageFromSupabase(card.back_image_url);
      }

      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
    }
  };

  const handleImageUpload = async (index, side, event) => {
    if (userPermission !== "edit") return;

    const file = event.target.files[0];
    if (!file) return;

    const uploadKey = `${index}-${side}`;

    try {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));

      const currentImageUrl = cards[index][`${side}_image_url`];
      if (currentImageUrl) {
        await deleteImageFromSupabase(currentImageUrl);
      }

      const cardId = `card-${setId || "new"}-${index}`;
      const imageUrl = await uploadImageToSupabase(file, cardId, side);

      updateCard(index, `${side}_image_url`, imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
      event.target.value = "";
    }
  };

  const removeImage = async (index, side) => {
    if (userPermission !== "edit") return;

    const imageUrl = cards[index][`${side}_image_url`];

    if (imageUrl) {
      await deleteImageFromSupabase(imageUrl);
    }

    updateCard(index, `${side}_image_url`, "");
  };

  const toggleTag = (index, tag) => {
    if (userPermission !== "edit") return;

    const card = cards[index];
    const newTags = card.tags.includes(tag)
      ? card.tags.filter((t) => t !== tag)
      : [...card.tags, tag];
    updateCard(index, "tags", newTags);
  };

  const handleCancel = () => {
    if (userPermission === "edit") {
      clearDraft(setId);
    }
    navigate("/dashboard/flashcards");
  };

  const handleSave = async () => {
    if (userPermission !== "edit") {
      alert("Bạn không có quyền chỉnh sửa bộ thẻ này");
      return;
    }

    if (!title.trim()) {
      alert("Vui lòng nhập tên bộ thẻ");
      return;
    }

    const validCards = cards.filter(
      (card) => card.front.trim() && card.back.trim()
    );
    if (validCards.length === 0) {
      alert("Vui lòng thêm ít nhất một thẻ có nội dung");
      return;
    }

    const stillUploading = Object.values(uploadingImages).some(
      (isUploading) => isUploading
    );
    if (stillUploading) {
      alert("Vui lòng đợi ảnh tải xong");
      return;
    }

    setIsSaving(true);
    try {
      const setData = {
        title: title.trim(),
        description: description.trim(),
        color: color,
        cards: validCards.map((card) => ({
          front: card.front,
          back: card.back,
          front_image_url: card.front_image_url || null,
          back_image_url: card.back_image_url || null,
          tags: card.tags || [],
        })),
      };

      let result;
      if (isNewSet) {
        result = await createSet(setData);
      } else {
        result = await updateSet(setId, setData);
      }

      if (result.success) {
        clearDraft(setId);
        navigate("/dashboard/flashcards");
      } else {
        throw new Error(result.error || "Failed to save set");
      }
    } catch (error) {
      console.error("Error saving set:", error);
      alert(`Có lỗi xảy ra khi lưu bộ thẻ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  const canEdit = userPermission === "edit";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {!isOwner && userPermission === "view" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-center space-x-3">
            <Lock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium">
                Chế độ chỉ xem
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">
                Bạn chỉ có quyền xem bộ thẻ này. Không thể chỉnh sửa.
              </p>
            </div>
          </div>
        )}

        {showDraftNotice && canEdit && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium">
                Đã khôi phục bản nháp
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Các thay đổi chưa lưu của bạn đã được khôi phục tự động
              </p>
            </div>
            <button
              onClick={() => setShowDraftNotice(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <h1 className="text-3xl font-bold text-gray-900">
                  {isNewSet
                    ? "Tạo bộ thẻ mới"
                    : canEdit
                    ? "Chỉnh sửa bộ thẻ"
                    : "Xem bộ thẻ"}
                </h1>
                {!isOwner && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Được chia sẻ
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {isNewSet
                  ? "Tạo bộ flashcard mới để học từ vựng"
                  : canEdit
                  ? "Chỉnh sửa nội dung bộ thẻ"
                  : "Xem nội dung bộ thẻ được chia sẻ"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
                <span>{canEdit ? "Hủy" : "Đóng"}</span>
              </button>
              {canEdit && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? "Đang lưu..." : "Lưu bộ thẻ"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-gray-600" />
            Cấu hình bộ thẻ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bộ thẻ *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => canEdit && setTitle(e.target.value)}
                  placeholder="Nhập tên bộ thẻ..."
                  disabled={!canEdit}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu chủ đạo
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => canEdit && setColor(colorOption)}
                      disabled={!canEdit}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === colorOption
                          ? "border-gray-800 scale-110"
                          : "border-gray-300 hover:scale-105"
                      } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => canEdit && setDescription(e.target.value)}
                placeholder="Mô tả về bộ thẻ này..."
                rows={4}
                disabled={!canEdit}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
                {cards.length}
              </span>
              Thẻ học
            </h2>
            {canEdit && (
              <button
                onClick={addCard}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm thẻ mới</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      Thẻ #{index + 1}
                    </span>
                    {card.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {canEdit && cards.length > 1 && (
                    <button
                      onClick={() => deleteCard(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {canEdit && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thẻ phân loại
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(index, tag)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            card.tags.includes(tag)
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Mặt trước
                      </label>
                      {canEdit && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            id={`front-image-${index}`}
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, "front", e)
                            }
                            className="hidden"
                          />
                          {uploadingImages[`${index}-front`] ? (
                            <div className="text-blue-600 text-sm">
                              Uploading...
                            </div>
                          ) : (
                            <label
                              htmlFor={`front-image-${index}`}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center space-x-1 text-sm"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Tải ảnh</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>

                    {card.front_image_url && (
                      <div className="relative">
                        <img
                          src={card.front_image_url}
                          alt="Front"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        {canEdit && (
                          <button
                            onClick={() => removeImage(index, "front")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <textarea
                      value={card.front}
                      onChange={(e) =>
                        updateCard(index, "front", e.target.value)
                      }
                      placeholder="Từ vựng, câu hỏi..."
                      rows={4}
                      disabled={!canEdit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Mặt sau
                      </label>
                      {canEdit && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            id={`back-image-${index}`}
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, "back", e)
                            }
                            className="hidden"
                          />
                          {uploadingImages[`${index}-back`] ? (
                            <div className="text-blue-600 text-sm">
                              Uploading...
                            </div>
                          ) : (
                            <label
                              htmlFor={`back-image-${index}`}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center space-x-1 text-sm"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Tải ảnh</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>

                    {card.back_image_url && (
                      <div className="relative">
                        <img
                          src={card.back_image_url}
                          alt="Back"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        {canEdit && (
                          <button
                            onClick={() => removeImage(index, "back")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <textarea
                      value={card.back}
                      onChange={(e) =>
                        updateCard(index, "back", e.target.value)
                      }
                      placeholder="Nghĩa, câu trả lời..."
                      rows={4}
                      disabled={!canEdit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Tổng cộng {cards.length} thẻ •{" "}
              {
                cards.filter((card) => card.front.trim() && card.back.trim())
                  .length
              }{" "}
              thẻ hoàn thành
            </div>
            {canEdit && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={addCard}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  + Thêm thẻ nhanh
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetEditorModal;
