import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Palette,
  Tag,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";
import { supabase } from "../../services/supabase";

const SetEditorModal = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { sets, createSet, updateSet } = useFlashcards();

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
    if (existingSet) {
      setTitle(existingSet.title);
      setDescription(existingSet.description);
      setColor(existingSet.color || "#3B82F6");
      setCards(
        existingSet.cards?.length
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
            ]
      );
    }
  }, [existingSet]);

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
        console.log("Not a Supabase URL, skipping deletion");
        return;
      }

      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      console.log("Deleting image:", fileName);

      const { error } = await supabase.storage
        .from("flashcard-images")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image:", error);
      } else {
        console.log("Image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const addCard = () => {
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
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const deleteCard = async (index) => {
    if (cards.length > 1) {
      const card = cards[index];

      // Delete associated images
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
    const file = event.target.files[0];
    if (!file) return;

    const uploadKey = `${index}-${side}`;

    try {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));

      // Delete previous image if exists
      const currentImageUrl = cards[index][`${side}_image_url`];
      if (currentImageUrl) {
        await deleteImageFromSupabase(currentImageUrl);
      }

      const cardId = `card-${setId || "new"}-${index}`;
      const imageUrl = await uploadImageToSupabase(file, cardId, side);

      updateCard(index, `${side}_image_url`, imageUrl);

      // Show success message
      console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
      // Reset the file input
      event.target.value = "";
    }
  };

  const removeImage = async (index, side) => {
    const imageUrl = cards[index][`${side}_image_url`];

    if (imageUrl) {
      await deleteImageFromSupabase(imageUrl);
    }

    updateCard(index, `${side}_image_url`, "");
  };

  const toggleTag = (index, tag) => {
    const card = cards[index];
    const newTags = card.tags.includes(tag)
      ? card.tags.filter((t) => t !== tag)
      : [...card.tags, tag];
    updateCard(index, "tags", newTags);
  };

  const handleSave = async () => {
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
      alert("Please wait for images to finish uploading");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <h1 className="text-3xl font-bold text-gray-900">
                  {isNewSet ? "Tạo bộ thẻ mới" : "Chỉnh sửa bộ thẻ"}
                </h1>
              </div>
              <p className="text-gray-600">
                {isNewSet
                  ? "Tạo bộ flashcard mới để học từ vựng"
                  : "Chỉnh sửa nội dung bộ thẻ"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/dashboard/flashcards")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? "Đang lưu..." : "Lưu bộ thẻ"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Set Configuration */}
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên bộ thẻ..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === colorOption
                          ? "border-gray-800 scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả về bộ thẻ này..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
                {cards.length}
              </span>
              Thẻ học
            </h2>
            <button
              onClick={addCard}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm thẻ mới</span>
            </button>
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
                  {cards.length > 1 && (
                    <button
                      onClick={() => deleteCard(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Tags Selection */}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Front Side */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Mặt trước
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`front-image-${index}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, "front", e)}
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
                    </div>

                    {card.front_image_url && (
                      <div className="relative">
                        <img
                          src={card.front_image_url}
                          alt="Front"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              e.target.src
                            );
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          onClick={() => removeImage(index, "front")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <textarea
                      value={card.front}
                      onChange={(e) =>
                        updateCard(index, "front", e.target.value)
                      }
                      placeholder="Từ vựng, câu hỏi..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Back Side */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Mặt sau
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`back-image-${index}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, "back", e)}
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
                    </div>

                    {card.back_image_url && (
                      <div className="relative">
                        <img
                          src={card.back_image_url}
                          alt="Back"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              e.target.src
                            );
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          onClick={() => removeImage(index, "back")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <textarea
                      value={card.back}
                      onChange={(e) =>
                        updateCard(index, "back", e.target.value)
                      }
                      placeholder="Nghĩa, câu trả lời..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetEditorModal;
