import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useTestResults = (testType) => {
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const { user, session } = useAuth();
    const [results, setResults] = useState({
    tests: [],
    totalCompleted: 0,
    averageBand: null,
    averageScore: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!user || !session) {
        setResults((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const response = await fetch(
          `https://smjypkielfgtyaddrpbb.supabase.co/rest/v1/test_results?user_id=eq.${user.id}&test_type=eq.${testType}&status=eq.completed&select=*&order=created_at.desc`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: supabaseKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();

        // Group by test_number
        const testsByNumber = {};

        data.forEach((test) => {
          const num = test.test_number;

          if (!testsByNumber[num]) {
            testsByNumber[num] = [];
          }
          testsByNumber[num].push(test);
        });

        // Get best attempt for each test number
        const tests = Object.keys(testsByNumber).map((num) => {
          const attempts = testsByNumber[num];
          let best;

          if (testType === "writing") {
            // For writing, find highest word count
            best = attempts.reduce((prev, curr) =>
              (curr.word_count || 0) > (prev.word_count || 0) ? curr : prev
            );
            return {
              test_number: parseInt(num),
              attempts: attempts.length,
              best_score: best.word_count || 0,
              best_band: null,
              time_taken: best.time_taken_seconds,
              completed_at: best.completed_at,
            };
          } else if (testType === "speaking") {
            // For speaking, find highest rating
            best = attempts.reduce((prev, curr) =>
              (curr.average_self_rating || 0) > (prev.average_self_rating || 0)
                ? curr
                : prev
            );
            return {
              test_number: parseInt(num),
              attempts: attempts.length,
              best_score: best.average_self_rating || 0,
              best_band: null,
              time_taken: null,
              completed_at: best.completed_at,
            };
          } else {
            // For listening/reading, find highest band score
            best = attempts.reduce((prev, curr) =>
              (curr.band_score || 0) > (prev.band_score || 0) ? curr : prev
            );
            return {
              test_number: parseInt(num),
              attempts: attempts.length,
              best_score: best.score || 0,
              best_band: best.band_score || 0,
              time_taken: best.time_taken_seconds,
              completed_at: best.completed_at,
            };
          }
        });

        const totalCompleted = tests.length;
        let averageBand = null;
        let averageScore = null;

        if (totalCompleted > 0) {
          if (testType === "writing" || testType === "speaking") {
            averageScore =
              tests.reduce((sum, t) => sum + t.best_score, 0) / totalCompleted;
          } else {
            averageBand =
              tests.reduce((sum, t) => sum + t.best_band, 0) / totalCompleted;
            averageScore =
              tests.reduce((sum, t) => sum + t.best_score, 0) / totalCompleted;
          }
        }

        setResults({
          tests,
          totalCompleted,
          averageBand: averageBand ? Math.round(averageBand * 10) / 10 : null,
          averageScore: averageScore
            ? Math.round(averageScore * 10) / 10
            : null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Failed to fetch test results:", error);
        setResults((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchResults();
  }, [user, session, testType]);

  return results;
};
