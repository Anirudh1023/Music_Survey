import React, { useEffect, useRef } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import * as SurveyTheme from "survey-core/themes";
import "./index.css";
import { json } from "./json";
import song1 from "./static/audio1.mp3";
import song2 from "./static/audio2.mp3";


function SurveyComponent() {
  const survey = new Model(json);
  const audioRef = useRef(null);
  const currentPageRef = useRef(survey.currentPage?.name);
  const pageEnterTimeRef = useRef(Date.now());
  const pageTimeSpent = useRef({});

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const playAudioForPage = (pageName) => {
      const pageAudioMap = {
        "page21": song1,
        "page39": song2,
        // Define your mappings here
      };

      const audioUrl = pageAudioMap[pageName];
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      }
    };

    const handlePageChange = () => {
      const newPageName = survey.currentPage.name;

      // Calculate and log time spent on the previous page
      const currentTime = Date.now();
      const previousPageName = currentPageRef.current;
      if (previousPageName) { // Skip for the very first load
        const timeSpent = currentTime - pageEnterTimeRef.current;
        pageTimeSpent.current[previousPageName] = (pageTimeSpent.current[previousPageName] || 0) + timeSpent;
      }

      // Update for the new page
      currentPageRef.current = newPageName;
      pageEnterTimeRef.current = currentTime;

      playAudioForPage(newPageName);
    };

    // Register the event listener for page changes
    survey.onCurrentPageChanged.add(handlePageChange);

    // Handle survey completion
    survey.onComplete.add(() => {
      // Stop any audio playback
      audioRef.current.pause();

      // Final logging for the last page
      const finalPageName = survey.currentPage.name;
      const finalTimeSpent = Date.now() - pageEnterTimeRef.current;
      pageTimeSpent.current[finalPageName] = (pageTimeSpent.current[finalPageName] || 0) + finalTimeSpent;
      console.log("Final time spent on pages (ms):", pageTimeSpent.current);
      console.log("Survey data:", survey.data);
      localStorage.setItem("surveyData", JSON.stringify(survey.data));
      localStorage.setItem("pageTimeSpent", JSON.stringify(pageTimeSpent.current));
    });

    // Initial setup for audio playback
    if (survey.currentPage) {
      playAudioForPage(survey.currentPage.name);
    }

    return () => {
      // Cleanup on component unmount
      survey.onCurrentPageChanged.remove(handlePageChange);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Dependency array is empty, effect runs only once on mount

  survey.applyTheme(SurveyTheme.ContrastLight);
  survey.data = {
    "nps-score": 9,
    "promoter-features": ["performance", "ui"],
  };

  return <Survey model={survey} />;
}

export default SurveyComponent;