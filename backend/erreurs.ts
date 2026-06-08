/**
 * Erreur levée quand les entrées d'une requête sont invalides (champ obligatoire manquant ou vide).
 * Mappée sur le code HTTP 400 par le middleware d'erreur central.
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

/**
 * Erreur levée quand aucune ressource ne correspond à l'identifiant demandé.
 * Mappée sur le code HTTP 404 par le middleware d'erreur central.
 */
export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}
