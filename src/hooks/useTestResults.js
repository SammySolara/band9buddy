import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";


export const useTestResults = (testType) => {
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const { user, session } = useAuth();
    const [results, setResults] = useState({
    tests: [], // Individual test results by test_number
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
              apikey: supabaseKey, // Add your anon key here
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();

        // Group by test_number and get best attempt for each
        const testsByNumber = data.reduce((acc, test) => {
          const num = test.test_number;
          if (!acc[num] || test.band_score > acc[num].band_score) {
            acc[num] = {
              test_number: num,
              attempts: data.filter((t) => t.test_number === num).length,
              best_score: test.score,
              best_band: test.band_score,
              time_taken: test.time_taken_seconds,
              completed_at: test.completed_at,
            };
          }
          return acc;
        }, {});

        const tests = Object.values(testsByNumber);
        const totalCompleted = tests.length;
        const averageBand =
          totalCompleted > 0
            ? tests.reduce((sum, t) => sum + t.best_band, 0) / totalCompleted
            : null;
        const averageScore =
          totalCompleted > 0
            ? tests.reduce((sum, t) => sum + t.best_score, 0) / totalCompleted
            : null;

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
