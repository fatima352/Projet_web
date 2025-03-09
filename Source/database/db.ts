import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Créer une base de données SQLite
const db = new DB("Database");

// CREATION DE LA TABLE DES UTILISATURES \\
/*Pres condition : 
        id : identifiant de l'utilisateur
        name : nom prenom de l'utilisatuer
        birthdate : date de naissance de l'utilisateur format DD-MM-YYYY
        email : adresse mail de l'utilisatuer
        adress : adresse de l'utilisateur
        tel_number : numero de telephonde de l'utilisateur
        password : mots de passe de l'utilisatuer
*/
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        birthdate TEXT, -- Stocker la date de naissance au format YYYY-MM-DD
        email STRING,
        adress STRING,
        tel_number INTEGER,
        password STRING
    );
`);

// FONCTION DE GESTION DES UTILISATEURS \\

// Fonction pour créer un nouvel utilisateur
// Paramètres:
//   - name (string): Le nom de l'utilisateur.
//   - birthdate (string): La date de naissance de l'utilisateur (format "YYYY-MM-DD").
//   - email (string): L'email de l'utilisateur.
//   - adress (string): L'adresse de l'utilisateur.
//   - tel_number (number): Le numéro de téléphone de l'utilisateur.
//   - password (string): Le mot de passe de l'utilisateur.
export function createUser(name: string, birthdate: string, email: string, adress: string, tel_number: number, password: string) {
    db.query(`
        INSERT INTO users (name, birthdate, email, adress, tel_number, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [name, birthdate, email, adress, tel_number, password]);
    console.log("Utilisateur créé avec succès");
}


// Fonction pour calculer l'âge de l'utilisateur
export function calculateAge(birthdate: string): number {
    // Séparation de la date au format européen (DD-MM-YYYY)
    const [day, month, year] = birthdate.split('-').map(Number);

    // Création d'un objet Date en utilisant les valeurs extraites
    const birthDate = new Date(year, month - 1, day); // Le mois commence à 0, donc on soustrait 1

    // Récupération de l'année actuelle
    const currentYear = new Date().getFullYear();

    // Calcul de l'âge
    let age = currentYear - birthDate.getFullYear();

    // Vérification si l'anniversaire de cette année est déjà passé ou non
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    if (currentMonth < month - 1 || (currentMonth === month - 1 && currentDay < day)) {
        age--; // Si l'anniversaire n'est pas encore passé, on soustrait 1 à l'âge
    }

    return age;
}

//Vérifier si un utilisateur existe par son ID
/* UserExists = True -> l'utilisateur existe 
   UserExists = False -> l'utilisateur n'existe pas
*/
function userExists(user_id: number): boolean {
    const rows = db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    return rows.length > 0;
}

// Fonction pour récupérer un utilisateur par son ID
// Retourne les informations de l'utilisateur si trouvé, sinon retourne null
export function getUserById( userId: number) {
    // Vérifie si l'utilisateur avec l'ID donné existe dans la base de données
    if(!userExists(userId)){
        console.log("Utilisateur introuvable");
        return null; 
    }
    const rows = db.query("SELECT id, name, age, email, adress, tel_number FROM users WHERE id = ?", [userId]);
    return rows[0];
}

// Fonction pour mettre à jour les informations d'un utilisateur
// On peut modifier tous les champs sauf l'identifiant (userId) de l'utilisateur
//Retourne les informations de l'utilisateur modifié si trouvé, sinon retourne null
export function updateUser( userId: number, name: string, age: number, email: string, adress: string, tel_number: number, password: string) {
    // Vérifie si l'utilisateur avec l'ID donné existe dans la base de données 
    if(!userExists(userId)){
        console.log("Utilisateur introuvable");
        return null;
    }
    const rows = db.query(`
        UPDATE users 
        SET name = ?, age = ?, email = ?, adress = ?, tel_number = ?, password = ?
        WHERE id = ?
    `, [name, age, email, adress, tel_number, password, userId]);
    
    console.log("Utilisateur modifié avec succès");
    console.log(rows);
    return rows[0];
}

// Fonction pour supprimer un utilisateur de la base de données
// Supprime le compte de l'utilisateur si l'utilisateur existe
export function deleteUser(userId: number) {
    // Vérifie si l'utilisateur avec l'ID donné existe dans la base de données
    if (!userExists(userId)) {
        console.log("Utilisateur introuvable");
        return;
    }
    db.query("DELETE FROM users WHERE id = ?", [userId]);
    console.log("Utilisateur supprimé avec succès");
}


//pour vider la base de donnée ❌
export function deleteAllUsers() {
    db.query("DELETE FROM users");  // Supprimer tous les utilisateurs
    console.log("Tous les utilisateurs ont été supprimés")
}


// TABLES DES VOITURES \\
/* Pré condition : 
    id: identifiant unique de la voiture, auto-incrémenté
    brand : marque de la voiture
    model : modèle de la voiture
    year : année de fabrication de la voiture
    price : prix de location de la voiture par jour
    description : description de la voiture (caractéristiques, etc.)
    status : statut de disponibilité de la voiture : 0 = indisponible, 1 = disponible
*/
db.query(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT,
        model TEXT,
        year INTEGER,
        price INTEGER,
        description TEXT,
        status INTEGER CHECK(status IN (0, 1)) -- 0 = indisponible, 1 = disponible
    );
`);

// Fonction de gestion des voitures \\

// Fonction pour insérer une nouvelle voiture dans la table 'cars'
// Cette fonction ajoute une voiture avec les informations spécifiées : marque, modèle, année, prix, description et statut
export function createCar(brand: string, model: string, year: number, price: number, description: string, status: string) {
    db.query(`
        INSERT INTO cars (brand, model, year, price, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [brand, model, year, price, description, status]);
    console.log("Voiture créée avec succès");

}

// Fonction pour vérifier si une voiture existe dans la base de données par son ID
// Retourne true si la voiture existe, sinon false
function carExists(car_id: number): boolean {
    const rows = db.query("SELECT id FROM cars WHERE id = ?", [car_id]);
    return rows.length > 0;
}
// Fonction pour récupérer une voiture par son ID
// Retourne les informations de la voiture si trouvée, sinon retourne null
export function getCarById(carId: number) {
    // Vérifie si la voiture avec l'ID spécifié existe dans la base de données
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return null;
    }
    const rows = db.query("SELECT id, brand, model, year, price, description, status FROM cars WHERE id = ?", [carId]);
    // Affiche les informations de la voiture dans la console
    console.log("Voiture :");
    console.log(rows[0]);
    return rows[0];  
}

// Fonction pour récupérer toutes les voitures d'une même marque
// Retourne une liste de voitures correspondant à la marque spécifiée
export function getCarByBrand(brand: string) {
    const rows = db.query("SELECT id, brand, model, year, price, description, status FROM cars WHERE brand = ?", [brand]);
    // Si aucune voiture n'est trouvée pour cette marque, on affiche un message et on retourne 0
    if(rows.length === 0){
        console.log("Aucune voiture trouvée pour cette marque.");
        return 0;
    }
    console.log(rows);
    return rows;
}

// Fonction pour mettre à jour les informations d'une voiture
// On peut modifier tous les champs sauf l'identifiant (carId) de la voiture
export function updateCar(carId: number, brand: string, model: string, year: number, price: number, description: string, status: string) {
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return null;
    }
    const updatecar = db.query(`
            UPDATE cars 
            SET brand = ?, model = ?, year = ?, price = ?, description = ?, status = ?
            WHERE id = ?
        `, [brand, model, year, price, description, status, carId]);

    console.log("Modifié avec succès.");
    console.log(updatecar);
}

// Fonction pour supprimer une voiture par son ID
// Supprime la voiture si elle existe dans la base de données
export function deleteCar(carId: number) {
    // Vérifie si la voiture avec l'ID spécifié existe dans la base de données
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return;
    }
    db.query("DELETE FROM cars WHERE id = ?", [carId]);
    console.log("Supprimée avec succès");
}

// Fonction pour récupérer toutes les voitures de la base de données
// Retourne une liste de toutes les voitures présentes dans la table 'cars'
export function getAllCars() {
    return db.query("SELECT id, brand, model, year, price, description, status FROM cars");
}

//afficher toutes les voitures dans la console
export function Display(){
    const result = db.query("SELECT COUNT(*) FROM cars");
    const count = result[0][0]; 
    const allCars = getAllCars();
    if(count === 0){
        console.log("Base de donnée vide");
    }else{
        console.log("Voitures:");
        for (const car of allCars) {
        console.log(car);
        }
    }
}

//supprimer toutes les voitures
export function deleteAllCars() {
    db.query("DELETE FROM cars");  // Supprimer tous les utilisateurs
    console.log("SUPPRIMER TOUT LES CARS")
}

// TABLE DES LOCATIONS \\
/*precondition :
        id : identifiant unique pour chaque location, auto-incrémenté
        car_id : clé étrangère qui fait référence à l'ID de la voiture louée
        user_id :clé étrangère qui fait référence à l'ID l'utilisateur qui loue la voiture
        start_date : Date de début de la location (au format texte)
        end_date : Date de fin de la location (au format texte)
        price : prix total de la location
*/

db.query(`
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER,
        user_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        price REAL,
        FOREIGN KEY(car_id) REFERENCES cars(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

// Fonction pour créer une nouvelle location de voiture
// Cette fonction enregistre une location avec les informations de la voiture, de l'utilisateur,
// les dates de début et de fin de la location, et le prix de la location
// Retourne le detaille de la location ou null si l'utilisateur ou la voiture n'existe pas
export function createLocation(car_id: number, user_id: number, start_date: string, end_date: string, price: number) {    
    // Vérifie si l'utilisateur et la voiture existent avant de créer la location
    if (!userExists(user_id) || !carExists(car_id)) {
        console.log("Utilisateur ou voiture introuvable");
        return null;
    }
    const rows = db.query(`
        INSERT INTO locations (car_id, user_id, start_date, end_date, price)
        VALUES (?, ?, ?, ?, ?)
    `, [car_id, user_id, start_date, end_date, price]);
    console.log("Location créée avec succès");
    return rows
}

// Récupère toutes les locations d'un utilisateur par son ID.
// Paramètre:
//   - user_id (number): L'ID de l'utilisateur.
// Retour:
//   - Un tableau d'objets contenant les informations des locations (id, car_id, user_id, start_date, end_date, price),
//     ou null si aucune location n'est trouvée.
// Affiche les informations des locations dans la console si des résultats sont trouvés.
export function GetLocationByUser(user_id: number) {
    const user_locations = db.query(`
        SELECT id, car_id, user_id, start_date, end_date, price 
        FROM locations 
        WHERE user_id = ?`, 
        [user_id]
    );

    if (user_locations.length === 0) {
        console.log(`Aucune location trouvée pour l'utilisateur ID ${user_id}`);
        return null;
    } else {
        console.log(`Locations de l'utilisateur ID ${user_id}:`);
        for (const location of user_locations) {
            console.log(location);
        }
        return user_locations;
    }
}


// Récupère toutes les locations faites pour une voiture par son ID.
// Paramètre:
//   - car_id (number): L'ID de la voiture.
//
// Retour:
//   - Un tableau d'objets contenant les informations des locations (id, car_id, user_id, start_date, end_date, price),
//     ou null si aucune location n'est trouvée.
// Affiche les informations des locations dans la console si des résultats sont trouvés.
export function GetLocationByCars(car_id: number) {
    const car_locations = db.query(`
        SELECT id, car_id, user_id, start_date, end_date, price 
        FROM locations 
        WHERE car_id = ?`, 
        [car_id]
    );

    if (car_locations.length === 0) {
        console.log(`Aucune location trouvée pour la voiture ID ${car_id}`);
        return null;
    } else {
        console.log(`Locations de la voiture ID ${car_id}:`);
        for (const location of car_locations) {
            console.log(location);
        }
        return car_locations;
    }
}

// Fonction pour calculer la durée d'une location en jours
// Paramètres:
//   - start_date (string): La date de début de la location (format "YYYY-MM-DD").
//   - end_date (string): La date de fin de la location (format "YYYY-MM-DD").
//
// Retour:
//   - Un nombre représentant le nombre de jours entre les deux dates.
export function calculateRentalDuration(start_date: string, end_date: string): number {
    // Convertir les dates en objets Date
    const start = new Date(start_date);
    const end = new Date(end_date);
    // Calculer la différence entre les dates en millisecondes
    const difference = end.getTime() - start.getTime();
    // Convertir la différence en jours (1 jour = 24 heures = 1000 * 3600 * 24 millisecondes)
    const days = difference / (1000 * 3600 * 24);

    return days;
}
