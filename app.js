// app.js
document.addEventListener('DOMContentLoaded', function () {
    // Configuration de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCL7j96cZAAVTNkRGySg_aY2JLk0ZxCQ_I",
        authDomain: "work-timer-3a33a.firebaseapp.com",
        projectId: "work-timer-3a33a",
        storageBucket: "work-timer-3a33a.appspot.com",
        messagingSenderId: "1082397268266",
        appId: "1:1082397268266:web:f2d5ec82f07080a792e653"
    };
  
    // Initialiser Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  
    const startStopButton = document.getElementById('startStopButton');
    const chronoDisplay = document.getElementById('chrono');
    const totalTimeDisplay = document.getElementById('totalTime');
  
    let isWorking = false;
    let startTime;
    let totalTime = 0;
  
    const updateChrono = () => {
      if (!isWorking) return;
  
      const now = new Date();
      const elapsed = now - startTime;
      const elapsedSeconds = Math.floor(elapsed / 1000);
      const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsedSeconds % 60).padStart(2, '0');
      chronoDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    };
  
    const updateTotalTimeDisplay = () => {
      const totalSeconds = Math.floor(totalTime / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      totalTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    };
  
    startStopButton.addEventListener('click', () => {
      if (isWorking) {
        const endTime = new Date();
        const workDuration = endTime - startTime;
        totalTime += workDuration;
  
        // Sauvegarder l'entrée en base de données
        db.collection('workTime').add({
          start: firebase.firestore.Timestamp.fromDate(startTime),
          end: firebase.firestore.Timestamp.fromDate(endTime),
          duration: workDuration
        });
  
        isWorking = false;
      } else {
        startTime = new Date();
        isWorking = true;
      }
  
      updateTotalTimeDisplay();
    });
  
    setInterval(updateChrono, 1000);
  
    // Charger les temps de travail depuis la base de données
    db.collection('workTime').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        totalTime += doc.data().duration;
      });
      updateTotalTimeDisplay();
    });
  });
  