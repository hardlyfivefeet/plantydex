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


class Plant {
  constructor(image, info) {
    this.image = image;
    this.info = info;
  }
}


let fileInput = document.getElementById("fileInput");
let thumbnailImage = document.getElementById("thumbnail");
let commonName = document.getElementById("commonName");
let scientificName = document.getElementById("scientificName");
let readMore = document.getElementById("readMore");
let plantydexItems = document.getElementById("plantydexItems");
let score = document.getElementById("score");

// window.localStorage.removeItem("plants");

let plants = JSON.parse(localStorage.getItem("plants")) || [];
for (let plant of plants) {
  addToPlantydex(plant);
}

fileInput.addEventListener("change", function (event) {
  let plantImage = event.target.files[0];
  let reader = new FileReader();
  reader.onload = function () {
    let apiResponseInfo = JSON.parse(mockJson);
    let plant = new Plant(reader.result, apiResponseInfo["plant"]);
    if (!plants.find(o => o.info["name"] === plant.info["name"])) {
      plants.push(plant);
      localStorage.setItem("plants", JSON.stringify(plants));
      addToPlantydex(plant);
    } else {
      alert("Plant already collected in Plantydex!");
    }
  };
  reader.readAsDataURL(plantImage);
});

function addToPlantydex(plant) {
  let img = new Image();
  img.src = plant.image;
  img.className = "plantydexItem";
  img.addEventListener("click", function () {
    thumbnailImage.src = plant.image;
    commonName.textContent = plant.info["common_name"];
    scientificName.textContent = plant.info["name"];
    readMore.href = plant.info["url"];
    readMore.textContent = "Read More";
  });
  plantydexItems.appendChild(img);
  score.textContent = plants.length;
}
