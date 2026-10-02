"use client";

import React, { useState } from "react";
import styles from "./DocumentationView.module.css";

type Lang = "en" | "fr";

// Each language is data rendered by one function, so both versions always
// have the same sections in the same order. Inline **bold** and `code` are
// supported in every string.
type Node =
  | { p: string }
  | { note: string }
  | { h3: string }
  | { ul: string[] }
  | { ol: string[] }
  | { blocks: Array<[string, string]> };

type Section = { id: string; title: string; body: Node[] };

const DOCS: Record<Lang, { intro: string; toc: string; sections: Section[] }> = {
  en: {
    toc: "On this page",
    intro:
      "What each part of this admin controls and where it shows up on linton.ma. Every field also has a short help text right under it; this page gives the bigger picture. Use `Ctrl/Cmd+F` to search it.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          {
            p: "linton.ma is the LINTON group's hub: it presents the group and sends visitors to the three specialised sites (linton-id.com, linton-cloud.com, linton-media.com). Everything visitors read on it is edited here.",
          },
          {
            ul: [
              "**Pages**: every page of the site (home, the group, contact, legal notice, and any page you add), each built from blocks.",
              "**Navigation**: the header menu, the header button and the footer links.",
              "**Business lines**: how the three LINTON sites are described, everywhere they appear.",
              "**Site settings**: site name and default SEO, contact details, contact-form texts, footer texts.",
              "**Messages**: every message sent through the contact form.",
              "**Media**: uploaded images.",
              "**Users**: the people who can log in to this admin.",
            ],
          },
        ],
      },
      {
        id: "languages",
        title: "French & English",
        body: [
          {
            p: "The site exists in French (the default) and English. You edit one language at a time: switch with the **Locale** menu at the top right of the admin (**Paramètres régionaux** when the admin is in French).",
          },
          {
            p: "Blocks, their order, links and menu items are shared by both languages; only the texts are translated. Adding, moving or removing a block therefore changes both versions. After adding one in French, switch to English and translate its texts.",
          },
          {
            note: "An English text left empty shows the French one on the English site. Handy while translating, but easy to forget: check the English version before publishing.",
          },
          { p: "The language of the admin itself (buttons, menus) is a separate setting, in your **Account**." },
        ],
      },
      {
        id: "pages",
        title: "Pages & blocks",
        body: [
          {
            p: "Each page is a document in **Pages**. Its **slug** is its address without the language: `about` is linton.ma/fr/about and linton.ma/en/about. The homepage's slug is `home`. Use `/` for sub-pages, e.g. `about/team`.",
          },
          {
            p: "The **Layout** field is the page content, top to bottom: a stack of blocks you add, reorder by dragging, duplicate or remove. The same block can be used several times on a page. Available blocks:",
          },
          {
            blocks: [
              ["Hero", "The large dark section at the top of the homepage: two-line headline (the second line in green), text, two buttons and the animated LINTON visual."],
              ["Page header", "The dark title band at the top of every other page, with the breadcrumb (Home / title)."],
              ["Business lines grid", "The three cards linking to the LINTON sites, under a heading. The card texts come from Business lines. Links to `#lines` scroll to this block."],
              ["Chain", "Dark section with numbered steps, each showing one LINTON site's logo (Capture → Use → Protect on the homepage)."],
              ["Values", "A row of cards, each with a small code, a title and a text."],
              ["Story & key figures", "Title on the left, paragraphs on the right, and an optional row of big numbers below."],
              ["Contact band", "Dark band with a button that opens the contact form in a pop-up."],
              ["Contact form & details", "The full contact form, the contact details card, and links to the three LINTON sites."],
              ["Text", "Titled sections of formatted text: paragraphs, lists, links. Used for the legal notice."],
            ],
          },
          {
            p: "The **SEO & sharing** group sets the browser-tab title, the Google snippet and the link-preview image. Left empty, the defaults from Site settings are used.",
          },
          {
            note: "Changing a slug changes the page's address. Update every link to it (Navigation, buttons in blocks), or they will lead to a 'page not found'.",
          },
        ],
      },
      {
        id: "navigation",
        title: "Navigation",
        body: [
          {
            p: "**Header** tab: the menu items, in order (drag to reorder). Each item is either a **link to a page** (label + address) or the **'Our businesses' drop-down**, which lists the three LINTON sites under an intro sentence. Below the items, the green **button** on the right of the header.",
          },
          {
            p: "On phones the same menu opens full-screen: a 'Home' link first, then your links, then the three LINTON sites, then the button.",
          },
          {
            p: "**Footer** tab: the titles of the two link columns and the links of the second one. The first column always lists the three LINTON sites.",
          },
          {
            h3: "Writing addresses",
          },
          {
            ul: [
              "`/about`: a page of this site. The language (/fr or /en) is added automatically, so one link works on both versions.",
              "`/`: the homepage.",
              "`#lines`: scrolls to the business lines grid of the current page.",
              "`https://…`: another website, opened in a new tab. `mailto:` and `tel:` links work too.",
            ],
          },
        ],
      },
      {
        id: "business-lines",
        title: "Business lines",
        body: [
          {
            p: "The name, short name, pitch and capabilities of LINTON/ID, /Cloud and /Media. They appear in the 'Our businesses' drop-down, the business lines grids, the hero badges, the phone menu and the footer, so a change here updates all of them.",
          },
          {
            p: "The sites' addresses, logos and colours are fixed in the code: ask the developer to change them.",
          },
        ],
      },
      {
        id: "site-settings",
        title: "Site settings",
        body: [
          {
            ul: [
              "**General & SEO**: the site name (added to every tab title: 'Contact — LINTON'), the tagline shown on the link-preview image, and the default title and description used by pages that have none.",
              "**Contact details**: address, e-mail, phone and opening hours, shown by the 'Contact form & details' block. E-mail and phone are the same in both languages.",
              "**Contact form**: every text of the form (labels, the list of choices, button, success and error messages), on the contact page and in the pop-up.",
              "**Footer**: the text under the logo, the location and the rights line.",
            ],
          },
        ],
      },
      {
        id: "messages",
        title: "Messages",
        body: [
          {
            p: "Every message sent through the contact form is saved here, with the reference shown to the visitor after sending (e.g. `LNT-MBX3K2`). It is also e-mailed to the address set up on the server.",
          },
          {
            p: "The **E-mailed** box shows whether that e-mail went out. If it didn't, the message only exists here, so check this list regularly. Use **Status** and **Notes** to track your follow-up; visitors never see them.",
          },
        ],
      },
      {
        id: "media",
        title: "Media",
        body: [
          {
            p: "Images uploaded here can be picked as a page's link-preview image (SEO & sharing). The **alt text** describes the image for blind visitors and search engines and is required. Smaller copies are generated automatically.",
          },
        ],
      },
      {
        id: "publishing",
        title: "Drafts & publishing",
        body: [
          {
            ul: [
              "Pages have drafts: **Save draft** keeps your changes private, **Publish changes** puts them online (**Enregistrer le brouillon** / **Publier les modifications** in the French admin). The site shows them within seconds.",
              "A new page stays invisible until it is published.",
              "**Navigation**, **Business lines** and **Site settings** have no drafts: saving publishes immediately.",
              "The **Versions** tab of a page lists its previous versions and can restore one.",
            ],
          },
        ],
      },
      {
        id: "common-tasks",
        title: "Common tasks",
        body: [
          { h3: "Change the phone number or e-mail" },
          { ol: ["Site settings → Contact details.", "Edit the field and save. It's the same in both languages."] },
          { h3: "Add a page and put it in the menu" },
          {
            ol: [
              "Pages → Create new. Fill in the title and a slug, e.g. `services`.",
              "In Layout, add a **Page header** block, then the blocks you need.",
              "Publish.",
              "Switch the Locale to English, translate the texts, publish again.",
              "Navigation → Header → Add menu item: 'Link to a page', label, address `/services`. Save, then translate the label in English and save.",
            ],
          },
          { h3: "Update the legal notice" },
          { ol: ["Pages → Legal notice.", "Edit the sections of the Text block, in French then in English.", "Publish."] },
          { h3: "Answer a contact message" },
          { ol: ["Messages → open the message.", "Reply from your mailbox to the visitor's e-mail.", "Set the status to Answered."] },
          { h3: "Remove a page" },
          { ol: ["Remove its links from Navigation (header and footer) and from buttons in other pages.", "Open the page and unpublish or delete it."] },
          { h3: "Give someone access to the admin" },
          { ol: ["Users → Create new, with their e-mail and a password.", "They can change the password from their Account."] },
        ],
      },
    ],
  },
  fr: {
    toc: "Sur cette page",
    intro:
      "Ce que contrôle chaque partie de cet espace d'administration et où cela apparaît sur linton.ma. Chaque champ a aussi une courte aide juste en dessous ; cette page donne la vue d'ensemble. Utilisez `Ctrl/Cmd+F` pour y chercher.",
    sections: [
      {
        id: "overview",
        title: "Vue d'ensemble",
        body: [
          {
            p: "linton.ma est le site vitrine du groupe LINTON : il présente le groupe et oriente les visiteurs vers les trois sites spécialisés (linton-id.com, linton-cloud.com, linton-media.com). Tout ce que les visiteurs y lisent se modifie ici.",
          },
          {
            ul: [
              "**Pages** : toutes les pages du site (accueil, le groupe, contact, mentions légales et celles que vous ajoutez), chacune construite avec des blocs.",
              "**Navigation** : le menu de l'en-tête, le bouton de l'en-tête et les liens du pied de page.",
              "**Business lines** (métiers) : la description des trois sites LINTON, partout où ils apparaissent.",
              "**Site settings** (paramètres du site) : nom du site et référencement par défaut, coordonnées, textes du formulaire de contact, textes du pied de page.",
              "**Messages** : tous les messages envoyés avec le formulaire de contact.",
              "**Media** : les images téléversées.",
              "**Users** : les personnes qui peuvent se connecter à cet espace.",
            ],
          },
        ],
      },
      {
        id: "languages",
        title: "Français et anglais",
        body: [
          {
            p: "Le site existe en français (par défaut) et en anglais. On modifie une langue à la fois : changez-la avec le menu **Paramètres régionaux** en haut à droite de l'administration (**Locale** quand l'administration est en anglais).",
          },
          {
            p: "Les blocs, leur ordre, les liens et les éléments de menu sont communs aux deux langues ; seuls les textes sont traduits. Ajouter, déplacer ou supprimer un bloc modifie donc les deux versions. Après avoir ajouté un bloc en français, passez en anglais et traduisez ses textes.",
          },
          {
            note: "Un texte anglais laissé vide affiche le texte français sur le site anglais. Pratique pendant la traduction, mais facile à oublier : vérifiez la version anglaise avant de publier.",
          },
          { p: "La langue de l'administration elle-même (boutons, menus) est un réglage séparé, dans votre **Compte**." },
        ],
      },
      {
        id: "pages",
        title: "Pages et blocs",
        body: [
          {
            p: "Chaque page est un document de **Pages**. Son **slug** est son adresse sans la langue : `about` correspond à linton.ma/fr/about et linton.ma/en/about. Le slug de la page d'accueil est `home`. Utilisez `/` pour les sous-pages, par exemple `about/team`.",
          },
          {
            p: "Le champ **Layout** est le contenu de la page, de haut en bas : une pile de blocs que vous ajoutez, réordonnez par glisser-déposer, dupliquez ou supprimez. Un même bloc peut servir plusieurs fois sur une page. Blocs disponibles :",
          },
          {
            blocks: [
              ["Hero", "La grande section sombre en haut de la page d'accueil : titre sur deux lignes (la seconde en vert), texte, deux boutons et le visuel animé LINTON."],
              ["Page header", "Le bandeau de titre sombre en haut des autres pages, avec le fil d'Ariane (Accueil / titre)."],
              ["Business lines grid", "Les trois cartes vers les sites LINTON, sous un titre. Les textes des cartes viennent de Business lines. Les liens vers `#lines` font défiler jusqu'à ce bloc."],
              ["Chain", "Section sombre à étapes numérotées, chacune avec le logo d'un site LINTON (Capturer → Exploiter → Protéger sur l'accueil)."],
              ["Values", "Une rangée de cartes, chacune avec un petit code, un titre et un texte."],
              ["Story & key figures", "Titre à gauche, paragraphes à droite et, en option, une rangée de grands chiffres en dessous."],
              ["Contact band", "Bandeau sombre avec un bouton qui ouvre le formulaire de contact en fenêtre."],
              ["Contact form & details", "Le formulaire de contact complet, la carte des coordonnées et les liens vers les trois sites LINTON."],
              ["Text", "Sections de texte mis en forme avec un titre : paragraphes, listes, liens. Utilisé pour les mentions légales."],
            ],
          },
          {
            p: "Le groupe **SEO & sharing** définit le titre de l'onglet, l'extrait affiché par Google et l'image d'aperçu des liens partagés. Laissés vides, les valeurs par défaut des Site settings s'appliquent.",
          },
          {
            note: "Changer un slug change l'adresse de la page. Mettez à jour tous les liens vers elle (Navigation, boutons des blocs), sinon ils mèneront à une « page introuvable ».",
          },
        ],
      },
      {
        id: "navigation",
        title: "Navigation",
        body: [
          {
            p: "Onglet **Header** : les éléments du menu, dans l'ordre (glissez pour réordonner). Chaque élément est soit un **lien vers une page** (libellé + adresse), soit le **menu déroulant « Nos métiers »**, qui liste les trois sites LINTON sous une phrase d'introduction. En dessous, le **bouton** vert à droite de l'en-tête.",
          },
          {
            p: "Sur téléphone, le même menu s'ouvre en plein écran : un lien « Accueil » d'abord, puis vos liens, les trois sites LINTON et le bouton.",
          },
          {
            p: "Onglet **Footer** : les titres des deux colonnes de liens et les liens de la seconde. La première colonne liste toujours les trois sites LINTON.",
          },
          { h3: "Écrire une adresse" },
          {
            ul: [
              "`/about` : une page de ce site. La langue (/fr ou /en) est ajoutée automatiquement : un seul lien sert aux deux versions.",
              "`/` : la page d'accueil.",
              "`#lines` : fait défiler jusqu'à la grille des métiers de la page.",
              "`https://…` : un autre site, ouvert dans un nouvel onglet. Les liens `mailto:` et `tel:` fonctionnent aussi.",
            ],
          },
        ],
      },
      {
        id: "business-lines",
        title: "Métiers (Business lines)",
        body: [
          {
            p: "Le nom, le nom court, le pitch et les compétences de LINTON/ID, /Cloud et /Media. Ils apparaissent dans le menu « Nos métiers », les grilles de métiers, les badges du hero, le menu téléphone et le pied de page : une modification ici les met tous à jour.",
          },
          {
            p: "Les adresses, logos et couleurs des sites sont fixés dans le code : demandez au développeur pour les changer.",
          },
        ],
      },
      {
        id: "site-settings",
        title: "Paramètres du site",
        body: [
          {
            ul: [
              "**General & SEO** : le nom du site (ajouté à chaque titre d'onglet : « Contact — LINTON »), le slogan affiché sur l'image d'aperçu des liens, et le titre et la description par défaut des pages qui n'en ont pas.",
              "**Contact details** : adresse, e-mail, téléphone et horaires, affichés par le bloc « Contact form & details ». L'e-mail et le téléphone sont identiques dans les deux langues.",
              "**Contact form** : tous les textes du formulaire (libellés, liste des choix, bouton, messages de réussite et d'erreur), sur la page contact et dans la fenêtre.",
              "**Footer** : le texte sous le logo, la localisation et la mention des droits.",
            ],
          },
        ],
      },
      {
        id: "messages",
        title: "Messages",
        body: [
          {
            p: "Chaque message envoyé avec le formulaire de contact est enregistré ici, avec la référence montrée au visiteur après l'envoi (par exemple `LNT-MBX3K2`). Il est aussi envoyé par e-mail à l'adresse configurée sur le serveur.",
          },
          {
            p: "La case **E-mailed** indique si cet e-mail est bien parti. Sinon, le message n'existe qu'ici : consultez cette liste régulièrement. **Status** et **Notes** servent à votre suivi ; les visiteurs ne les voient jamais.",
          },
        ],
      },
      {
        id: "media",
        title: "Médias",
        body: [
          {
            p: "Les images téléversées ici peuvent servir d'image d'aperçu d'une page (SEO & sharing). Le **texte alternatif** décrit l'image pour les visiteurs aveugles et les moteurs de recherche ; il est obligatoire. Des copies plus petites sont générées automatiquement.",
          },
        ],
      },
      {
        id: "publishing",
        title: "Brouillons et publication",
        body: [
          {
            ul: [
              "Les pages ont des brouillons : **Enregistrer le brouillon** garde vos modifications privées, **Publier les modifications** les met en ligne. Le site les affiche en quelques secondes.",
              "Une nouvelle page reste invisible tant qu'elle n'est pas publiée.",
              "**Navigation**, **Business lines** et **Site settings** n'ont pas de brouillon : enregistrer publie immédiatement.",
              "L'onglet **Versions** d'une page liste ses versions précédentes et permet d'en restaurer une.",
            ],
          },
        ],
      },
      {
        id: "common-tasks",
        title: "Tâches courantes",
        body: [
          { h3: "Changer le numéro de téléphone ou l'e-mail" },
          { ol: ["Site settings → Contact details.", "Modifiez le champ et enregistrez. Il est identique dans les deux langues."] },
          { h3: "Ajouter une page et la mettre dans le menu" },
          {
            ol: [
              "Pages → **Créer**. Saisissez le titre et un slug, par exemple `services`.",
              "Dans Layout, ajoutez un bloc **Page header**, puis les blocs nécessaires.",
              "Publiez.",
              "Passez les Paramètres régionaux sur English, traduisez les textes, publiez à nouveau.",
              "Navigation → Header → ajoutez un élément de menu : « Link to a page », libellé, adresse `/services`. Enregistrez, puis traduisez le libellé en anglais et enregistrez.",
            ],
          },
          { h3: "Mettre à jour les mentions légales" },
          { ol: ["Pages → Mentions légales.", "Modifiez les sections du bloc Text, en français puis en anglais.", "Publiez."] },
          { h3: "Répondre à un message de contact" },
          { ol: ["Messages → ouvrez le message.", "Répondez depuis votre messagerie à l'e-mail du visiteur.", "Passez le statut à Answered."] },
          { h3: "Supprimer une page" },
          { ol: ["Retirez ses liens de Navigation (en-tête et pied de page) et des boutons des autres pages.", "Ouvrez la page et dépubliez-la ou supprimez-la."] },
          { h3: "Donner accès à l'administration" },
          { ol: ["Users → **Créer**, avec son e-mail et un mot de passe.", "La personne peut changer son mot de passe depuis son Compte."] },
        ],
      },
    ],
  },
};

// **bold** and `code` inside a string.
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
        if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

function Block({ node }: { node: Node }) {
  if ("p" in node) return <p><Inline text={node.p} /></p>;
  if ("note" in node) return <p className={styles.note}><Inline text={node.note} /></p>;
  if ("h3" in node) return <h3><Inline text={node.h3} /></h3>;
  if ("ul" in node) return <ul>{node.ul.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
  if ("ol" in node) return <ol>{node.ol.map((item) => <li key={item}><Inline text={item} /></li>)}</ol>;
  return (
    <ul className={styles.blockList}>
      {node.blocks.map(([name, description]) => (
        <li key={name}>
          <strong>{name}</strong>
          <Inline text={description} />
        </li>
      ))}
    </ul>
  );
}

export function DocumentationBody({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const docs = DOCS[lang];

  return (
    <div className={styles.page}>
      <nav className={styles.toc} aria-label="Documentation sections">
        <div className={styles.langSwitch} role="group" aria-label="Page language">
          <button type="button" className={lang === "fr" ? styles.langActive : styles.langButton} onClick={() => setLang("fr")}>
            Français
          </button>
          <button type="button" className={lang === "en" ? styles.langActive : styles.langButton} onClick={() => setLang("en")}>
            English
          </button>
        </div>
        <p className={styles.tocTitle}>{docs.toc}</p>
        <ul className={styles.tocList}>
          {docs.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.content} lang={lang}>
        <h1>Documentation</h1>
        <p className={styles.intro}>
          <Inline text={docs.intro} />
        </p>
        {docs.sections.map((section) => (
          <section key={section.id} id={section.id} className={styles.section}>
            <h2>{section.title}</h2>
            {section.body.map((node, index) => (
              <Block key={index} node={node} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
