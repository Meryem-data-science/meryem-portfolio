# Portfolio — Meryem El Mustad

Portfolio statique bilingue français / anglais, conçu pour présenter les projets, compétences et expériences en Data Science, BI et IA appliquée. Recherche de stage PFE 2027.

## Site public

[Voir le portfolio](https://meryem-data-science.github.io/meryem-portfolio/)

## Aperçu local

Servir ce dossier avec un serveur HTTP, par exemple :

```powershell
python -m http.server 4173
```

Ouvrir ensuite `http://127.0.0.1:4173`.

## Structure

- `index.html` : contenu bilingue, études de cas et structure accessible
- `styles.css` : design responsive, thèmes clair et sombre, mouvements réduits
- `script.js` : filtres, sélection locale, études de cas, langue et navigation
- `assets/` : portrait, favicon et couverture de partage

## Parcours et interactions

Les projets sont filtrables par Data & BI, AI & ML et Produit & UX. Chaque fiche présente le problème, la contribution et le livrable. Le visiteur peut garder une sélection de projets, la retrouver dans son navigateur et inclure leurs titres dans un brouillon d’email. Le lien de contact ouvre la messagerie du visiteur ; aucun message n’est envoyé automatiquement.

Le parcours reprend les principes de découverte progressive et d’investissement de Hooked : un besoin clair, une action simple, une étude à découvrir et une sélection facultative à conserver. Il n’y a ni inscription, ni collecte de données, ni mécanique de notification.

La langue, le thème et la sélection sont stockés avec `localStorage`. Si ce stockage est indisponible, le site fonctionne pour la visite en cours. Les études restent consultables avec les éléments natifs `details` lorsque JavaScript est désactivé. Les modales utilisent `dialog`, avec fermeture par Échap et retour du focus au déclencheur. Les animations respectent `prefers-reduced-motion`.

Les illustrations de projets sont graphiques et ne sont pas des captures de produits ou des résultats mesurés. Le contenu conserve les expériences et compétences présentées dans le portfolio d’origine, sans ajouter de résultats de performance non documentés. L’agent vidéo et les liens de téléchargement du CV ne sont plus présentés.

## Publication

Le site fonctionne directement sur GitHub Pages, sans compilation ni dépendances JavaScript de production. Les liens relatifs fonctionnent sous `/meryem-portfolio/`.

## Vérification

Vérifier le rendu ordinateur et mobile, les filtres, les études de cas, la sélection et sa persistance, la langue, les thèmes, le menu mobile, la navigation au clavier et l’absence de liens de téléchargement du CV.
