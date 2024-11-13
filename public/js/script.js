// script.js
console.log("Script connected");

const countDisplay = document.getElementById("countValue");
const socket = io();

let video;
let model;
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

// Load the Coco SSD model
async function loadModel() {
  try {
    model = await cocoSsd.load();
    console.log("Model loaded successfully:", model);
  } catch (error) {
    console.error("Error loading Coco SSD model:", error);
    alert("Failed to load the Coco SSD model. Please check your internet connection and model URL.");
  }
}

// Initialize webcam feed
async function setupWebcam() {
  video = document.getElementById("webcam");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("Webcam stream obtained");
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        console.log("Webcam metadata loaded");
        resolve(video);
      };
    });
  } catch (error) {
    console.error("Error accessing the webcam:", error);
    alert("Webcam access was denied or not available. Please check permissions.");
  }
}

// Detect people in the video feed and draw bounding boxes
async function detectPeople() {
  if (!model) {
    console.warn("Model is not loaded yet");
    return;
  }

  try {
    const predictions = await model.detect(video);
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Count people and draw bounding boxes
    let peopleCount = 0;
    predictions.forEach((prediction) => {
      if (prediction.class === "person") {
        peopleCount += 1;

        // Draw bounding box
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw label
        ctx.font = "18px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          x,
          y > 20 ? y - 5 : y + 20
        );
      }
    });

    // Update people count
    countDisplay.innerText = peopleCount;
    
    // Emit real-time passenger count to server
    socket.emit("passengerCount", { count: peopleCount });
    console.log("People count:", peopleCount);

  } catch (error) {
    console.error("Error in detectPeople():", error);
  }
}

// Main function to initialize the model, webcam, and start detection
async function main() {
  try {
    console.log("Starting main function...");

    // Load the model
    await loadModel();
    console.log("Model loaded in main()");

    // Initialize the webcam
    await setupWebcam();
    console.log("Webcam initialized in main()");

    // Start detection loop
    setInterval(detectPeople, 5000); // Detect every 5 seconds
  } catch (error) {
    console.error("Error in main():", error);
  }
}

// Run main function to start everything
main();
