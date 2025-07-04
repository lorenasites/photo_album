const fileInput = document.getElementById("fileUpload");
const imageContainer = document.getElementById("imageContainer"); // Changed to a container for multiple images

// Function to load images from localStorage on page load
const loadImagesFromStorage = () => {
  const savedImagesJSON = localStorage.getItem("savedImages");
  if (savedImagesJSON) {
    const savedImages = JSON.parse(savedImagesJSON);
    imageContainer.innerHTML = ""; // Clear existing images
    savedImages.forEach((imageDataUrl) => {
      createImageElement(imageDataUrl);
    });
  }
};

// Function to create and append an image element
const createImageElement = (imageDataUrl) => {
  const img = document.createElement("img");
  img.src = imageDataUrl;
  img.classList.add("uploaded-image"); // Add a class for styling
  imageContainer.appendChild(img);
};

fileInput.addEventListener("change", async (e) => {
  const files = e.target.files;

  if (files.length === 0) {
    return; // No files selected
  }

  const currentImagesJSON = localStorage.getItem("savedImages");
  let currentImages = currentImagesJSON ? JSON.parse(currentImagesJSON) : [];

  // Use a Promise.all to handle multiple file reads asynchronously
  const fileReadPromises = Array.from(files).map((file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        reject("Not an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("An error occurred while reading a file.");
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  });

  try {
    const newImageDataUrls = await Promise.all(fileReadPromises);
    newImageDataUrls.forEach((imageDataUrl) => {
      currentImages.push(imageDataUrl); // Add new images to the array
      createImageElement(imageDataUrl); // Display the new image
    });
    localStorage.setItem("savedImages", JSON.stringify(currentImages)); // Save the updated array
  } catch (error) {
    console.error("Error processing files:", error);
  }

  fileInput.value = ""; // Clear the input so the same file can be selected again
});

// Load images when the page first loads
document.addEventListener("DOMContentLoaded", loadImagesFromStorage);
