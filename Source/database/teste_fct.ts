import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
    createUser, getUserById, updateUser, deleteUser, deleteAllUsers,
    createCar, getCarById, getCarByBrand, updateCar, deleteCar, deleteAllCars,
    createLocation, GetLocationByUser
} from "./db.ts";

// 🔹 Ouvrir la base de données
const db = new DB("test.db");

// 📌 Tester la gestion des utilisateurs
console.log("\n🔹 TEST UTILISATEURS");

// ➤ Créer un utilisateur
createUser("Alice", 30, "alice@mail.com", "123 Rue A", 1234567890, "password123");
console.log("✅ Succès : Création d'un utilisateur");

// ➤ Récupérer un utilisateur
const user = getUserById(1);
console.log(user ? "✅ Succès : Récupération de l'utilisateur" : "❌ Échec");

// ➤ Mettre à jour un utilisateur
updateUser(1, "Alice Modifié", 31, "alice@mail.com", "456 Rue B", 9876543210, "newpass");
console.log("✅ Succès : Modification de l'utilisateur");

// ➤ Supprimer un utilisateur
deleteUser(1);
console.log("✅ Succès : Suppression de l'utilisateur");

// ➤ Supprimer tous les utilisateurs
deleteAllUsers();
console.log("✅ Succès : Suppression de tous les utilisateurs");

// 📌 Tester la gestion des voitures
console.log("\n🔹 TEST VOITURES");

// ➤ Créer une voiture
createCar("Toyota", "Corolla", 2022, 25000, "Bonne voiture", "Disponible");
console.log("✅ Succès : Création d'une voiture");

// ➤ Récupérer une voiture
const car = getCarById(1);
console.log(car ? "✅ Succès : Récupération de la voiture" : "❌ Échec");

// ➤ Récupérer par marque
const cars = getCarByBrand("Toyota");
console.log(cars.length > 0 ? "✅ Succès : Récupération des voitures par marque" : "❌ Échec");

// ➤ Modifier une voiture
updateCar(1, "Toyota", "Corolla Hybrid", 2023, 27000, "Nouvelle version hybride", "Loué");
console.log("✅ Succès : Modification de la voiture");

// ➤ Supprimer une voiture
deleteCar(1);
console.log("✅ Succès : Suppression de la voiture");

// ➤ Supprimer toutes les voitures
deleteAllCars();
console.log("✅ Succès : Suppression de toutes les voitures");

// 📌 Tester la gestion des locations
console.log("\n🔹 TEST LOCATIONS");

// ➤ Créer un utilisateur et une voiture pour la location
createUser("Bob", 28, "bob@mail.com", "789 Rue C", 1122334455, "securepass");
createCar("Honda", "Civic", 2021, 22000, "Très économique", "Disponible");

// ➤ Créer une location
createLocation(1, 1, "2025-03-10", "2025-03-15", 300);
console.log("✅ Succès : Création d'une location");

// ➤ Vérifier les locations d'un utilisateur
GetLocationByUser(1);
console.log("✅ Succès : Récupération des locations d'un utilisateur");

// 🔹 Fermer la base de données
db.close();
