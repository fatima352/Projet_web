import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Créer une base de données SQLite
const db = new DB("Database");

// CREATION DE LA TABLE DES UTILISATURES \\
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        email STRING,
        adress STRING,
        tel_number INTEGER,
        password STRING
    );
`);

// FONCTION DE GESTION DES UTILISATEURS \\

// Insérer un nouvel utilisateur dans la table
export function createUser(name: string, age: number, email: string, adress: string, tel_number: number, password: string) {
    db.query(`
        INSERT INTO users (name, age, email, adress, tel_number, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [name, age, email, adress, tel_number, password]);
    console.log("Utilisateur créer avec succes");
}
//Vérifier si un utilisateur existe par son ID
function userExists(user_id: number): boolean {
    const rows = db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    return rows.length > 0;
}

// Récupérer un utilisateur par son ID
export function getUserById( userId: number) {
    const rows = db.query("SELECT id, name, age, email, adress, tel_number FROM users WHERE id = ?", [userId]);
    if(!userExists(userId)){
        console.log("Utilisateur introuvable");
        return;
    }
    return rows[0];
}

// Mettre à jour un utilisateur
// on peut tout changer sauf l'identifiant de l'utilisateur
export function updateUser( userId: number, name: string, age: number, email: string, adress: string, tel_number: number, password: string) {
    if(!userExists(userId)){
        console.log("Utilisateur introuvable");
        return;
    }
    const rows = db.query(`
        UPDATE users 
        SET name = ?, age = ?, email = ?, adress = ?, tel_number = ?, password = ?
        WHERE id = ?
    `, [name, age, email, adress, tel_number, password, userId]);
    
    console.log("Modifier avec succes");
    console.log(rows);
}

// Supprimer un utilisateur
// on supprime le compte de l'utilisatuer si il le veut
export function deleteUser( userId: number) {
    const rows = db.query("SELECT count(*) users WHERE id = ?", [userId]);
    if(!userExists(userId)){
        console.log("Utilisateur introuvable");
        return;
    }
    else{    
        db.query("DELETE FROM users WHERE id = ?", [userId]);
        console.log("Supprimer avec succes");
    }

}
//pour vider la base de donnée ❌
export function deleteAllUsers() {
    db.query("DELETE FROM users");  // Supprimer tous les utilisateurs
    console.log("SUPPRIMER TOUT LES UTILISATUERS")
}


// TABLES DES VOITURES \\

db.query(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT,
        model TEXT,
        year INTEGER,
        price INTEGER,
        description TEXT,
        status TEXT
    );
`);

// Fonction de gestion des voitures \\

// Insérer une nouvelle voiture dans la table
export function createCar(brand: string, model: string, year: number, price: number, description: string, status: string) {
    db.query(`
        INSERT INTO cars (brand, model, year, price, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [brand, model, year, price, description, status]);
    console.log("voiture cree avec succes");

}

// Vérifier si une voiture existe par son ID
function carExists(car_id: number): boolean {
    const rows = db.query("SELECT id FROM cars WHERE id = ?", [car_id]);
    return rows.length > 0;
}

// Récupérer une voiture par son ID
export function getCarById(carId: number) {
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return 0;
    }
    const rows = db.query("SELECT id, brand, model, year, price, description, status FROM cars WHERE id = ?", [carId]);
    console.log("Voiture :");
    console.log(rows[0]);
    return rows[0];  
}

// Récupérer les voiture de la meme marque 
export function getCarByBrand(brand: string) {
    const result = db.query("SELECT COUNT(*) FROM cars WHERE brand ?", [brand]);
    const count = result[0][0]; 
    if(count === 0){
        console.log("Pas de voiture de cette marque");
        return 0;
    }
    const rows = db.query("SELECT id, brand, model, year, price, description, status FROM cars WHERE brand = ?", [brand]);
    console.log(rows);
    return rows;
}

// Mettre à jour une voiture
// on peut tout modifier sauf le id
export function updateCar(carId: number, brand: string, model: string, year: number, price: number, description: string, status: string) {
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return 0;
    }
    const updatecar = db.query(`
            UPDATE cars 
            SET brand = ?, model = ?, year = ?, price = ?, description = ?, status = ?
            WHERE id = ?
        `, [brand, model, year, price, description, status, carId]);

    console.log("modifié avec succes");
    console.log(updatecar);
}

// Supprimer une voiture par son ID
export function deleteCar(carId: number) {
    if(!carExists(carId)){
        console.log("Voiture introuvable");
        return;
    }
    db.query("DELETE FROM cars WHERE id = ?", [carId]);
    console.log("Supprimer avec succes");
}
// Récupérer toutes les voitures
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

export function createLocation(car_id: number, user_id: number,start_date: string,end_date: string, price: number){
    const users = db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    const cars = db.query("SELECT id FROM cars WHERE id = ?", [car_id]);
    
    if (!(userExists(user_id))|| !(cars.length > 0)){
        alert("utilistauer ou voiture introuvables");
        console.log("utilistauer ou voiture introuvables");

    }
    else {
        db.query(`
        INSERT INTO cars (brand, model, year, price, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [car_id, user_id,start_date,end_date, price]);
    }
}

export function GetLocationByUser(user_id: number){
    const user_locations = db.query("SELECT id, name FROM users WHERE id = ?", [user_id]);
    console.log("Location de " + user_id);
    for(const location of user_locations){
        console.log(location);
    };
}


