import { Draggable, Sortable, Droppable } from "https://cdn.jsdelivr.net/npm/@shopify/draggable/build/esm/index.mjs";
const draggable = new Droppable(document.querySelectorAll(".edt-cell"), {
    draggable: ".cours",
    dropzone: ".edt-cell",
    classes: {},
});

let heuresCollision = [];
let coursEdited = null;

/*  draggable.on("drag:move", () => {
    document
        .querySelector(".draggable-mirror")
        .classList.remove("position-absolute");
});*/

// Initialisation des collisions des cours déjà présent. à adapter lors de l'ajout des cours dynamique
document.addEventListener("DOMContentLoaded", () => {
    let lesCours = getCours();
    lesCours.forEach((element) => {
        console.log(element.offsetHeight);
        let dureeCours = Math.floor(element.offsetHeight / 70);
        console.log(dureeCours);
        let i = 1;
        let cellToBlock = element.parentNode;
        while (i <= dureeCours && cellToBlock) {
            cellToBlock.classList.add("draggable-dropzone--occupied", "draggable-cours");
            cellToBlock = cellToBlock.nextElementSibling;
            i++;
        }
    });
});

draggable.on("drag:start", (dragEvent) => {
    coursEdited = dragEvent.source;
    let cellToUnblock = coursEdited.parentNode;
    let coursTaille = coursEdited.offsetHeight;
    //Transformation de la taille de la balise du cours en nombre d'heure de cours
    let coursDuree = coursTaille / 70;
    cellToUnblock = coursEdited.parentNode;
    for (let c = 0; c < coursDuree; c++) {
        cellToUnblock.classList.remove("draggable-dropzone--occupied", "draggable-cours");
        //Test de l'opérateur conditionnel, par curiosité
        cellToUnblock = c <= coursDuree ? cellToUnblock.nextElementSibling : null;
    }
    let jours = Array.from(document.querySelectorAll(".day-container"));
    let nbHeures = 10;

    for (let u = 0; u < jours.length; u++) {
        let heuresJour = Array.from(jours[u].querySelectorAll(".edt-cell"));
        for (let i = 1; i < coursDuree; i++) {
            if (!heuresJour[nbHeures - i].classList.contains("draggable-dropzone--occupied")) {
                heuresJour[nbHeures - i].classList.add("draggable-dropzone--occupied");
                heuresCollision.push(heuresJour[nbHeures - i]);
            }
        }
    }
    let lesCours = Array.from(document.querySelectorAll(".cours"));
    //Suppression du cours en cours de modification dans la liste pour éviter des collisions fantômes
    //C'est hyper bancale
    lesCours.splice(lesCours.indexOf(coursEdited), 2);
    lesCours.forEach((element) => {
        //Cellule à bloquer pour éviter une superposition
        let cellToBlock = element.parentNode.previousElementSibling;
        if (cellToBlock) {
            let i = 1;
            while (i < coursDuree && cellToBlock) {
                if (!cellToBlock.classList.contains("draggable-dropzone--occupied")) {
                    cellToBlock.classList.add("draggable-dropzone--occupied");
                    heuresCollision.push(cellToBlock);
                    cellToBlock = cellToBlock.previousElementSibling;
                }
                i++;
            }
        }
    });
});

draggable.on("drag:stop", (dragEvent) => {
    heuresCollision.forEach((element) => {
        element.classList.remove("draggable-dropzone--occupied");
    });
    let dureeCours = coursEdited.offsetHeight / 70;
    let i = 1;
    let cellToBlock = dragEvent.source.parentNode;
    while (i <= dureeCours && cellToBlock) {
        cellToBlock.classList.add("draggable-dropzone--occupied", "draggable-cours");
        cellToBlock = cellToBlock.nextElementSibling;
        i++;
    }
});

function getCours() {
    return Array.from(document.querySelectorAll(".cours"));
}
