# lazyImg
Lazy loader for image.
Don't need an external library
Don't need to modify your HTML to change the attribute of your images
SEO friendly

## How to use
#### Just call the script in header

## Customisation

### It's possible to change 
* the default image to display before to load the true one
* A custom_offset to load the true image before it enter in viewport, to avoid user to wait the download

`<script> lazyImg.setConfig('img/loading.gif', 400); </script>`

## Exemple

This script is used on this website [Tuto&Co](https://tutoandco.colas-delmas.fr) and more explanation in French [here](https://tutoandco.colas-delmas.fr/developpement/script-lazy-loading-image-accelerer-chargement-page/)