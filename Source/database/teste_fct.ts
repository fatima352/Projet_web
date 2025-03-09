import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
    createUser, getUserById, updateUser, deleteUser, deleteAllUsers,
    createCar, getCarById, getCarByBrand, updateCar, deleteCar, deleteAllCars,
    createLocation, GetLocationByUser
} from "./db.ts";

function test() {
    console.log("Début des tests...");

    // Supprimer tous les utilisateurs pour repartir à zéro
    deleteAllUsers();

    // Tester la création d'un utilisateur
    console.log("Test: Création d'utilisateur...");
    createUser("Alice", 25, "alice@example.com", "123 Rue des Lilas", 1234567890, "password123");
    
    // Vérifier si l'utilisateur a bien été créé
    const user = getUserById(1);
    if (user) {
        console.log("Utilisateur récupéré:", user);
    } else {
        console.error("Erreur: Utilisateur non trouvé après insertion!");
    }

    // Tester la mise à jour de l'utilisateur
    console.log("Test: Mise à jour de l'utilisateur...");
    updateUser(1, "Alice Dupont", 26, "alice.dupont@example.com", "456 Rue des Roses", 9876543210, "newpassword456");
    const updatedUser = getUserById(1);
    if (updatedUser && updatedUser[1] === "Alice Dupont") {
        console.log("Mise à jour réussie:", updatedUser);
    } else {
        console.error("Erreur: Mise à jour échouée!");
    }

    // Tester la suppression de l'utilisateur
    console.log("Test: Suppression de l'utilisateur...");
    deleteUser(1);
    const deletedUser = getUserById(1);
    if (!deletedUser) {
        console.log("Suppression réussie");
    } else {
        console.error("Erreur: L'utilisateur existe toujours après suppression!");
    }

    console.log("Tous les tests sont terminés.");
}

test();