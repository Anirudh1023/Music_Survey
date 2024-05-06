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

    const setupTimerPanel = (survey) => {
      const showTimer = survey.currentPage.maxTimeToFinish;
      survey.showTimerPanel = showTimer ? "top" : "none";
      if(showTimer) {
          survey.startTimer();
      } else {
          survey.stopTimer();
      }
   }

    const handlePageChange = () => {
      setupTimerPanel(survey);
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

    survey.onStarted.add(() => {
      survey.showNavigationButtons = false;
      setupTimerPanel(survey);
    });

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
      
      const values = {
        Name: survey.data.question1,
        Contact: survey.data.question2,
        Part_1: {
          Q1: {
            q1: { data: survey.data.question5 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page4 },
            q2: { data: survey.data.question10 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page5 },
            q3: { data: survey.data.question12 === "Item 4" ? 1 : 0, time: pageTimeSpent.current.page6 },
            q4: { data: survey.data.question11 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page7 },
            q5: { data: survey.data.question17 === "Image 2" ? 1 : 0, time: pageTimeSpent.current.page8 },
          },
          Q2: {
            q1: { data: survey.data.question22 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page10 },
            q2: { data: survey.data.question25 === true ? 1 : 0, time: pageTimeSpent.current.page11 },
            q3: { data: survey.data.question27 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page12 },
            q4: { data: survey.data.question9 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page13 },
            q5: { data: survey.data.question13 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page14 },
          },
          Q3: {
            q1: { data: survey.data.question18 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page16 },
            q2: { data: survey.data.question19 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page17 },
            q3: { data: survey.data.question23 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page18 },
            q4: { data: survey.data.question24 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page19 },
            q5: { data: survey.data.question26 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page20 },
          },
        },
        Part_2: {
          Q1: {
            q1: { data: survey.data.question30 === "Item 4" ? 1 : 0, time: pageTimeSpent.current.page22 },
            q2: { data: survey.data.question31 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page23 },
            q3: { data: survey.data.question32 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page24 },
            q4: { data: survey.data.question33 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page25 },
            q5: { data: survey.data.question34 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page26 },
          },
          Q2: {
            q1: { data: survey.data.question37 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page28 },
            q2: { data: survey.data.question38 === "Image 3" ? 1 : 0, time: pageTimeSpent.current.page29 },
            q3: { data: survey.data.question39 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page30 },
            q4: { data: survey.data.question40 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page31 },
            q5: { data: survey.data.question41 === "Item 4" ? 1 : 0, time: pageTimeSpent.current.page32 },
          },
          Q3: {
            q1: { data: survey.data.question44 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page34 },
            q2: { data: survey.data.question45 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page35 },
            q3: { data: survey.data.question46 === "Image 1" ? 1 : 0, time: pageTimeSpent.current.page36 },
            q4: { data: survey.data.question47 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page37 },
            q5: { data: survey.data.question48 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page38 },
          },
        },
        Part_3: {
          Q1: {
            q1: { data: survey.data.question51 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page40 },
            q2: { data: survey.data.question52 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page41 },
            q3: { data: survey.data.question53 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page42 },
            q4: { data: survey.data.question54 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page43 },
            q5: { data: survey.data.question55 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page44 },
          },
          Q2: {
            q1: { data: survey.data.question58 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page46 },
            q2: { data: survey.data.question59 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page47 },
            q3: { data: survey.data.question60 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page48 },
            q4: { data: survey.data.question61 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page49 },
            q5: { data: survey.data.question63 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page50 },
          },
          Q3: {
            q1: { data: survey.data.question66 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page52 },
            q2: { data: survey.data.question67 === "Item 1" ? 1 : 0, time: pageTimeSpent.current.page53 },
            q3: { data: survey.data.question68 === "Item 2" ? 1 : 0, time: pageTimeSpent.current.page54 },
            q4: { data: survey.data.question69 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page55 },
            q5: { data: survey.data.question70 === "Item 3" ? 1 : 0, time: pageTimeSpent.current.page56 },
          },
        },
      }

      localStorage.setItem("surveyData", JSON.stringify(values));

      const jsonString = JSON.stringify(values, null, 2);
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
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