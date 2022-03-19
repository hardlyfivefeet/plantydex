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

fileInput.addEventListener("change", event => {
  let plantImage = event.target.files[0];
  let reader = new FileReader();
  reader.onload = event => {
    let image = event.target.result;
    identify(image).then(data => {
      if (data["is_plant"]) {
        let plant = new Plant(image, data["suggestions"][0]["plant_details"]);
        if (!plants.find(o => o.info["scientific_name"] === plant.info["scientific_name"])) {
          plants.push(plant);
          localStorage.setItem("plants", JSON.stringify(plants));
          addToPlantydex(plant);
          showDetails(plant);
        } else {
          alert("This plant is already in your Plantydex!");
        }
      } else {
        alert("This is not a plant!");
      }
    });
  };
  reader.readAsDataURL(plantImage);
});

function addToPlantydex(plant) {
  let img = new Image();
  img.src = plant.image;
  img.className = "plantydexItem";
  img.addEventListener("click", () => showDetails(plant));
  plantydexItems.appendChild(img);
  score.textContent = plants.length;
}

function showDetails(plant) {
  thumbnailImage.src = plant.image;
  commonName.textContent = plant.info["common_names"][0];
  scientificName.textContent = plant.info["scientific_name"];
  readMore.href = plant.info["url"];
  readMore.textContent = "Read More";
}

async function identify(image) {
  let data = {
    api_key: "PF5tQJVC4uHLZCNNGEi02KdNldLfYBb5k50mKgb1lzEaZ77sUg",
    images: [image],
    plant_details: ["common_names", "url", "scientific_name"]
  };
  let args = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
  return fetch("https://api.plant.id/v2/identify", args).then(response => response.json());
}
