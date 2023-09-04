# Declarations

To add the "numeric_responsable.md" declaration add a file content like this
```json
{
  "name": "site name",
  "layout": "numeric-responsable",
  "translationKey": "index",
  "description": "",
  "clef": "index",
  "titre": "site title",
  "url": "/numeric-responsable",
  "width": 1920,
  "height": 1080,
  "grade": "A",
  "score": 84.5,
  "ges": 2.62,
  "water": 3.93,
  "date": "2023-07-17T16:58:27",
  "ecoindex_version": "5.4.2",
  "pages": [
    {
      "name": "Page d'accueil",
      "url": "",
      "width": 1920,
      "height": 1080,
      "size": 835.855,
      "nodes": 181,
      "requests": 21,
      "grade": "A",
      "score": 82.0,
      "ges": 1.36,
      "water": 2.04,
      "date": "2023-07-17T16:58:27",
      "ecoindex_version": "5.4.2"
    }
  ],
  "visit": [
    {
      "name": "Parcours complet",
      "objective": "Représenter une navigation d'un utilisateur",
      "target": "Naviguer a travers la totalité du site",
      "water": 3.93,
      "ges": 2.62,
      "pages": [
        "Page d'accueil",
      ]
    }
  ]
}
```

Dont forget to add our theme
```bash
git submodule add https://github.com/Labanquise/declaration-theme themes/declaration
```

then in hour base add
```html
{{- partial "declaration-head.html" . -}}
```