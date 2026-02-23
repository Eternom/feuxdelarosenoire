import { rename, mkdir } from "fs/promises"
import { join } from "path"

const GALLERY = join(process.cwd(), "public", "gallery")
const LOGOS = join(GALLERY, "logos")

// old name → new name (prefix "logos/" = move to logos subfolder)
const RENAMES = [
  // Photos de l'atelier
  ["atelier-1.webp",                                                    "forge-atelier-vue-ensemble.webp"],
  ["braise et outils.webp",                                             "braise-pinces-forge.webp"],
  ["braise_feux.webp",                                                  "braise-charbon-rougeoyant.webp"],
  ["enclume _sur_tron.webp",                                            "enclume-sur-tronc.webp"],
  ["enclume sur buche deux.webp",                                       "atelier-enclumes-multiples.webp"],
  ["feux qutre.webp",                                                   "flammes-evenement-exterieur.webp"],
  ["feux trois.webp",                                                   "flammes-charbon-forge.webp"],
  ["feux.webp",                                                         "flammes-forge-vives.webp"],
  ["feux_001.webp",                                                     "flammes-forge-nocturnes.webp"],
  ["marché chope.webp",                                                 "stand-marche-feux-rose-noire.webp"],
  ["personne_pratiquant_forge_001.webp",                                "forge-meuleuse-etincelles.webp"],
  ["pleind'outils.webp",                                                "mur-outils-forge-marteaux.webp"],
  ["resulta forge.webp",                                                "piece-forgee-marche.webp"],
  ["sculture.webp",                                                     "creations-couteaux-figurines.webp"],
  // Photos issues des réseaux sociaux
  ["06-348359304-615873963928263-2320705668727179751-n-1.webp",         "mur-outils-collection-atelier.webp"],
  ["16-436639999-945780703897958-4460614018053297591-n-1.webp",         "frappe-ciseau-sur-enclume.webp"],
  ["17-436771210-988381902925103-6496035066506163402-n-2.webp",         "marteau-enclume-gros-plan.webp"],
  ["18-438231596-414205584732461-6044934604660722434-n-1.webp",         "stand-poterie-exterieur.webp"],
  ["19-440501247-1871652969931150-6218773443915128176-n-1.webp",         "bols-poterie-impression-plantes.webp"],
  ["20-441157282-388612507499028-5129290421931101550-n-1.webp",         "bols-poterie-portrait.webp"],
  ["21-441945416-1136151314358561-2203580530114805328-n-1-1.webp",      "sculpture-metal-violoniste.webp"],
  ["22-441951516-3763165337284586-7582000597840524903-n-2.webp",        "foyer-forge-evenement-exterieur.webp"],
  ["23-448775658-1005264801252639-9019925642384164005-n-1.webp",        "stand-medieval-tentes.webp"],
  ["24-470054105-470608696068770-142481316912291107-n-2.webp",          "couteaux-forges-bois.webp"],
  ["25-470058348-1337841884029916-981701011865051054-n-1.webp",         "soudeur-sculpture-metal-geant.webp"],
  ["26-488254066-1199451298542123-1354328309037705848-n-2.webp",        "coulee-metal-fondu.webp"],
  ["34-img-20220820-001500032-1.webp",                                  "mur-outils-forge-panoramique.webp"],
  ["35-img-20220820-104317926-hdr-1.webp",                              "four-forge-fers-a-cheval.webp"],
  ["36-received-1670834630017428.webp",                                 "foyer-forge-demonstration.webp"],
  ["37-received-545909667437595.webp",                                  "sculpture-violoniste-stand-marche.webp"],
  ["38-received-565573958952952.webp",                                  "abeille-rose-forgee-macro.webp"],
  ["39-representation-lors-d-evenement.webp",                           "dragon-metal-crache-feu.webp"],
  // Logos & éléments graphiques → sous-dossier logos/
  ["27-affiches-diverse-pdf-8.webp",                                    "logos/qrcode.webp"],
  ["28-fb-img-1771438551399.webp",                                      "logos/affiche-evenement-chaudron-salem.webp"],
  ["29-frame-10-3.webp",                                                "logos/logo-feux-rose-noire-complet.webp"],
  ["30-frame-11-1.webp",                                                "logos/logo-rose-noire-icon.webp"],
  ["31-frame-11-2.webp",                                                "logos/logo-rose-noire-icon-2.webp"],
  ["32-frame-9-1.webp",                                                 "logos/logo-feux-partiel.webp"],
  ["33-frame-9-2.webp",                                                 "logos/logo-feux-rose-noire-carre.webp"],
]

await mkdir(LOGOS, { recursive: true })

let ok = 0
let skip = 0

for (const [oldName, newName] of RENAMES) {
  const src = join(GALLERY, oldName)
  const dst = newName.startsWith("logos/")
    ? join(GALLERY, newName)
    : join(GALLERY, newName)

  try {
    await rename(src, dst)
    console.log(`✓  ${oldName} → ${newName}`)
    ok++
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`–  skipped (not found): ${oldName}`)
      skip++
    } else {
      console.error(`✗  ${oldName}: ${err.message}`)
    }
  }
}

console.log(`\nDone: ${ok} renamed, ${skip} skipped.`)
