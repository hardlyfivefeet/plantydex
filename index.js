// Mock JSON data that would be received from API
const mockJson = `
{
  "id": 3010636,
  "plant": {
    "name": "Buddleja davidii",
    "url": "https://en.wikipedia.org/wiki/Buddleja_davidii",
    "common_name": "Butterfly-Bush"
  },
  "probability": 0.9277143686644568,
  "confidence": 0.9798141922207031,
  "similar_images": [
    {
      "id": "605775c7cb05e8463f7f8463b0fd915c",
      "similarity": 0.9318117206281141,
      "url": "https://storage.googleapis.com/plant_id_images/similar_images/2019_05/images/Buddleja davidii/605775c7cb05e8463f7f8463b0fd915c.jpg",
      "url_small": "https://storage.googleapis.com/plant_id_images/similar_images/2019_05/images/Buddleja davidii/605775c7cb05e8463f7f8463b0fd915c.small.jpg"
    },
    {
      "id": "890cf5e5b94a255ea4e517d785f53481",
      "similarity": 0.9316171609752804,
      "url": "https://storage.googleapis.com/plant_id_images/similar_images/2019_05/images/Buddleja davidii/890cf5e5b94a255ea4e517d785f53481.jpg",
      "url_small": "https://storage.googleapis.com/plant_id_images/similar_images/2019_05/images/Buddleja davidii/890cf5e5b94a255ea4e517d785f53481.small.jpg"
    }
  ],
  "confirmed": false
}
`;

// window.localStorage.removeItem("plantydexItems");

let plants;

getStoredPlantydexItems();

let plantydexItems = document.getElementById("plantydex-items");

for (const plant of plants) {
  addPlantydexItem(plant);
}

let fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function() {
  let plantImage = event.target.files[0];

  var reader = new FileReader();
  reader.onload = function(e) {
    let apiResponseInfo = JSON.parse(mockJson);
    let plant = new PlantydexItem(reader.result, apiResponseInfo["plant"]);
    // storePlantydexItem(plant);
    // addPlantydexItem(plant);

    if (!plants.find(o => o.info["name"] === plant.info["name"])) {
      storePlantydexItem(plant);
      addPlantydexItem(plant);
    } else {
      alert("Plant already collected in Plantydex!");
    }
  }
  reader.readAsDataURL(plantImage);
});

function storePlantydexItem(newPlantydexItem) {
  plants.push(newPlantydexItem);
  localStorage.setItem("plantydexItems", JSON.stringify(plants));
  getStoredPlantydexItems();
}

function getStoredPlantydexItems() {
  plants = JSON.parse(localStorage.getItem("plantydexItems")) || [];
}

function addPlantydexItem(plant) {
  let img = new Image();
  img.src = plant.image;
  img.className = "plantydex-item";
  img.addEventListener("click", function () {
    let thumbnailImage = document.getElementById("info-box-thumbnail");
    let commonName = document.getElementById("common-name");
    let scientificName = document.getElementById("scientific-name");
    let readMore = document.getElementById("read-more");

    thumbnailImage.src = plant.image;
    commonName.textContent = plant.info["common_name"];
    scientificName.textContent = plant.info["name"];
    readMore.href = plant.info["url"];
    readMore.textContent = "Read More"
  });
  plantydexItems.appendChild(img);
  updateScore();
}

function updateScore() {
  let score = document.getElementById("score");
  score.textContent = plants.length;
}
