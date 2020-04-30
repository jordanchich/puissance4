var IA = {
    choixColonne() {
        var tabColonne = this.getTableauCellulesPossibles(); //tabColonne recupere le tableau des cellules possibles (poids)
        var meilleureColonne = 0;
        var tabMeilleurColonne = [0];
        for (var i = 1; i < tabColonne.length; i++) {
            if (tabColonne[i] > tabColonne[meilleureColonne]) { // on verifie si la valeur de la colonne qu on regarde est superieure a la meilleure colonne
                meilleureColonne = i;
                tabMeilleurColonne = new Array(); // genere un tableau vide des meilleurs colonnes
                tabMeilleurColonne.push(i);
            } else if (tabColonne[i] === tabColonne[meilleureColonne]) {
                tabMeilleurColonne.push(i);
            }
        }
        return tabMeilleurColonne[Math.floor(Math.random() * tabMeilleurColonne.length)]; // cherche aleatoirement parmi les deux meilleures possibilités de meme poids ou juste la meilleure
    },

    getTableauCellulesPossibles: function () {
        var tabColonne = [];
        for (var i = 0; i < jeu.nbColonne; i++) {
            tabColonne.push(this.getPoidsCellule(jeu.retournerLigneCaseVideColonne(i), i)); //completer mon tableau de colonne de la possibilité
        }
        return tabColonne;
    },

    getPoidsCellule: function (ligne, colonne) {
        // la colonne est pleine --> le poids a renvoyer sera de 0
        if (ligne === -1) return 0;

        //verifier si on peut gagner (IA) --> on retourne un poids de 100
        if (this.verifGagner(ligne, colonne, 2)) return 100; // 2 = 2eme joueur
        if (this.verifGagner(ligne, colonne, 1)) return 99; // pour que l ia evite de perdre

        if(this.coupPerdant(ligne, colonne, 2)) return !0;

        var poids = 0;
        if (this.positionDefensive(ligne, colonne, 1)) poids += 20; // defense 
        if (this.positionDefensive(ligne, colonne, 2)) poids += 20; // attaque
        poids = this.positionDefensive(ligne, colonne, 1);

        return poids;



        // vrifier si on peut perdre (le joueur 1 peut gagner) --> retourne un poids de 99
        // autres cas 
        // eviter de faire un coup perdant 
        // defendre (2 jetons adverses à coté) --> le bloquer
        //attaquer (2 jetons de l ia a coté)
        // addition de poids 
    },

    getPoidsBase: function (ligne, colonne) {
        var poidsLigne = 0;
        var poidsColonne = 0;
        switch (ligne) {
            case 0:
                poidsLigne = 1;
                break;
            case 1:
                poidsLigne = 2;
                break;
            case 2:
                poidsLigne = 3;
                break;
            case 3:
                poidsLigne = 4;
                break;
            case 4:
                poidsLigne = 3;
                break;
            case 5:
                poidsLigne = 2;
                break;
        }
        switch (colonne) {
            case 0:
                poidsColonne = 1;
                break;
            case 1:
                poidsColonne = 2;
                break;
            case 2:
                poidsColonne = 3;
                break;
            case 3:
                poidsColonne = 3;
                break;
            case 4:
                poidsColonne = 3;
                break;
            case 5:
                poidsColonne = 2;
                break;
            case 6:
                poidsColonne = 1;
                break;
        }
        return poidsColonne * poidsLigne;
    },

    positionDefensive: function (ligne, colonne, joueur) {
        var cpt = 1; //position jeton potentiel
        if (jeu.puissance4[ligne][colonne + 1] === joueur){
            cpt++;
            if (jeu.puissance4[ligne][colonne + 2] === joueur && jeu.puissance4[ligne][colonne + 3] === 0)
            cpt++;
        }
            
        if (jeu.puissance4[ligne][colonne - 1] === joueur){
            cpt++;
            if (jeu.puissance4[ligne][colonne - 2] === joueur && jeu.puissance4[ligne][colonne - 3] === 0)
            cpt++;
        }

        if (cpt > 2)
            return true;
    },


    verifGagner: function (ligne, colonne, joueur) {
        if (this.verifGagnerLigne(ligne, colonne, joueur)) return true; // on peut gagner en ligne
        if (this.verifGagnerColonne(ligne, colonne, joueur)) return true; // on peut gagner en colonne
        if (this.verifGagnerDiagonale(ligne, colonne, joueur)) return true; // on peut gagner en colonne
    },
    verifGagnerLigne: function (ligne, colonne, joueur) {
        var cpt = 1; //compteur de jetons qu on veut placer dans la colonne
        if (jeu.puissance4[ligne][colonne + 1] === joueur) {
            cpt++;
            if (jeu.puissance4[ligne][colonne + 2] === joueur) {
                cpt++;
                if (jeu.puissance4[ligne][colonne + 3] === joueur) {
                    cpt++;
                }
            }
        }
        if (jeu.puissance4[ligne][colonne - 1] === joueur) {
            cpt++;
            if (jeu.puissance4[ligne][colonne - 2] === joueur) {
                cpt++;
                if (jeu.puissance4[ligne][colonne - 3] === joueur) {
                    cpt++;
                }
            }
        }
        if (cpt > 3) return true; // ca voudra dire qu on peut gagner
    },
    verifGagnerColonne: function (ligne, colonne, joueur) {
        var cpt = 1;
        if (ligne < 3) {
            if (jeu.puissance4[ligne + 1][colonne] === joueur) {
                cpt++;
                if (jeu.puissance4[ligne + 2][colonne] === joueur) {
                    cpt++;
                    if (jeu.puissance4[ligne + 3][colonne] === joueur) {
                        cpt++;
                    }
                }
            }
        }
        if (cpt > 3) return true;
    },
    verifGagnerDiagonale: function (ligne, colonne, joueur) {
        //diagonale vers la droite
        var cpt = 1;
        if ((ligne - 1 > 0) && (colonne + 1 <= nbColonne) && jeu.puissance4[ligne - 1][colonne + 1] === joueur) {
            cpt++;
            if ((ligne - 2 > 0) && (colonne + 2 <= nbColonne) && jeu.puissance4[ligne - 2][colonne + 2] === joueur) {
                cpt++;
                if ((ligne - 3 > 0) && (colonne + 3 <= nbColonne) && jeu.puissance4[ligne - 3][colonne + 3] === joueur) {
                    cpt++;
                }
            }
        }
        if ((ligne + 1 < jeu.nbLigne) && (colonne - 1 >= 0) && jeu.puissance4[ligne + 1][colonne - 1] === joueur) {
            cpt++;
            if ((ligne + 2 < jeu.nbLigne) && (colonne - 2 >= 0) && jeu.puissance4[ligne + 2][colonne - 2] === joueur) {
                cpt++;
                if ((ligne + 3 < jeu.nbLigne) && (colonne - 3 >= 0) && jeu.puissance4[ligne + 3][colonne - 3] === joueur) {
                    cpt++;
                }
            }
        }
        if (cpt > 3) return true;

        //diagonale vers la gauche
        cpt = 1;
        if ((ligne - 1 > 0) && (colonne - 1 >= 0) && jeu.puissance4[ligne - 1][colonne - 1] === joueur) {
            cpt++;
            if ((ligne - 2 > 0) && (colonne - 2 >= 0) && jeu.puissance4[ligne - 2][colonne - 2] === joueur) {
                cpt++;
                if ((ligne - 3 > 0) && (colonne - 3 >= 0) && jeu.puissance4[ligne - 3][colonne - 3] === joueur) {
                    cpt++;
                }
            }
        }
        if ((ligne + 1 < jeu.nbLigne) && (colonne + 1 <= jeu.nbColonne) && jeu.puissance4[ligne + 1][colonne + 1] === joueur) {
            cpt++;
            if ((ligne + 2 < jeu.nbLigne) && (colonne + 2 <= jeu.nbColonne) && jeu.puissance4[ligne + 2][colonne + 2] === joueur) {
                cpt++;
                if ((ligne + 3 < jeu.nbLigne) && (colonne + 3 <= jeu.nbColonne) && jeu.puissance4[ligne + 3][colonne + 3] === joueur) {
                    cpt++;
                }
            }
        }
    },
    coupPerdant: function (ligne, colonne, joueur){
        if(ligne - 1 > 0){
            if(this.verifGagner(ligne - 1, colonne, 1))
            return true;
        }
    }
}