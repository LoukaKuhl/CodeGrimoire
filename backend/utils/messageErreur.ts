export function messageErreur(erreur: unknown): string {
    return erreur instanceof Error ? erreur.message : 'Erreur inattendue'
}
