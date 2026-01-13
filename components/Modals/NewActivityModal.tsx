
import React, { useState } from 'react';
import { Activity, ActivityType, SelectionOption, ProtocolItem } from '../../types';
import { X, Check, Plus, Trash2, Search, GripVertical } from 'lucide-react';

interface NewActivityModalProps {
  activity?: Activity;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

// Emoji-Datenbank mit Namen für die Suche
type EmojiData = { emoji: string; names: string[] };

const EMOJI_DATABASE: EmojiData[] = [
  // Popular
  { emoji: "✨", names: ["stern", "sparkles", "glitzer", "magic", "zauber"] },
  { emoji: "🧘", names: ["meditation", "yoga", "meditieren", "lotus", "entspannung"] },
  { emoji: "💻", names: ["computer", "laptop", "pc", "arbeit", "coding"] },
  { emoji: "💧", names: ["wasser", "water", "tropfen", "trinken", "hydratation"] },
  { emoji: "💊", names: ["pille", "medizin", "medicine", "tablette", "gesundheit"] },
  { emoji: "🏃", names: ["laufen", "running", "rennen", "sport", "joggen"] },
  { emoji: "🥗", names: ["salat", "salad", "essen", "gesund", "mahlzeit"] },
  { emoji: "📚", names: ["buecher", "books", "lesen", "lernen", "bildung"] },
  { emoji: "😴", names: ["schlafen", "sleep", "schlaf", "muede", "ruhe"] },
  { emoji: "🧠", names: ["gehirn", "brain", "denken", "intelligenz", "lernen"] },
  { emoji: "🍎", names: ["apfel", "apple", "frucht", "obst", "gesund"] },
  { emoji: "🚶", names: ["gehen", "walking", "spazieren", "laufen", "bewegung"] },
  { emoji: "🚴", names: ["fahrrad", "bike", "radfahren", "cycling", "sport"] },
  { emoji: "🍳", names: ["kochen", "cooking", "essen", "kueche", "mahlzeit"] },
  { emoji: "🪴", names: ["pflanze", "plant", "gruen", "natur", "zimmerpflanze"] },
  { emoji: "🎨", names: ["kunst", "art", "malen", "kreativ", "design"] },
  { emoji: "🎸", names: ["gitarre", "guitar", "musik", "instrument", "spielen"] },
  { emoji: "✍️", names: ["schreiben", "writing", "text", "notizen", "journal"] },
  { emoji: "🧖", names: ["sauna", "wellness", "entspannung", "relax", "spa"] },
  { emoji: "🧹", names: ["putzen", "cleaning", "sauber", "haushalt", "aufraeumen"] },
  
  // Smileys & People
  { emoji: "😀", names: ["lachen", "smile", "gluecklich", "happy", "freude"] },
  { emoji: "😃", names: ["lachen", "grinsen", "happy", "freude", "spass"] },
  { emoji: "😄", names: ["lachen", "gluecklich", "happy", "freude"] },
  { emoji: "😁", names: ["strahlen", "beaming", "gluecklich", "freude"] },
  { emoji: "😆", names: ["lachen", "laughing", "spass", "freude"] },
  { emoji: "😅", names: ["schwitzen", "nervoes", "anstrengend", "sweat"] },
  { emoji: "😂", names: ["lachen", "laughing", "weinen", "freude", "spass"] },
  { emoji: "🤣", names: ["lachen", "rolling", "spass", "humor"] },
  { emoji: "😊", names: ["laechen", "smile", "freundlich", "gluecklich"] },
  { emoji: "😇", names: ["engel", "angel", "unschuldig", "gut"] },
  { emoji: "🙂", names: ["laechen", "smile", "freundlich"] },
  { emoji: "🙃", names: ["verkehrt", "upside", "spass", "humor"] },
  { emoji: "😉", names: ["zwinkern", "wink", "spass", "humor"] },
  { emoji: "😌", names: ["entspannt", "relieved", "ruhig", "zufrieden"] },
  { emoji: "😍", names: ["liebe", "love", "herz", "verliebt", "schon"] },
  { emoji: "🥰", names: ["liebe", "love", "herz", "verliebt"] },
  { emoji: "😘", names: ["kuss", "kiss", "liebe", "herz"] },
  { emoji: "😗", names: ["kuss", "kiss", "liebe"] },
  { emoji: "😙", names: ["kuss", "kiss", "liebe"] },
  { emoji: "😚", names: ["kuss", "kiss", "liebe"] },
  { emoji: "😋", names: ["lecker", "yummy", "essen", "geschmack"] },
  { emoji: "😛", names: ["zunge", "tongue", "spass", "humor"] },
  { emoji: "😝", names: ["zunge", "tongue", "spass", "verrueckt"] },
  { emoji: "😜", names: ["zunge", "tongue", "spass", "humor"] },
  { emoji: "🤪", names: ["verrueckt", "crazy", "spass", "humor"] },
  { emoji: "🤨", names: ["skeptisch", "skeptical", "zweifel", "frage"] },
  { emoji: "🧐", names: ["monokel", "monocle", "suchen", "untersuchen"] },
  { emoji: "🤓", names: ["nerd", "brille", "intelligent", "schlau"] },
  { emoji: "😎", names: ["sonnenbrille", "cool", "laessig", "stil"] },
  { emoji: "🤩", names: ["stern", "star", "begeistert", "wow"] },
  { emoji: "🥳", names: ["party", "feiern", "geburtstag", "spass"] },
  { emoji: "😏", names: ["laechen", "smirk", "selbstbewusst", "stolz"] },
  { emoji: "😒", names: ["unzufrieden", "unimpressed", "langweilig"] },
  { emoji: "😞", names: ["traurig", "sad", "enttaeuscht", "ungluecklich"] },
  { emoji: "😔", names: ["traurig", "sad", "nachdenklich", "bedauern"] },
  { emoji: "😟", names: ["besorgt", "worried", "sorge", "angst"] },
  { emoji: "😕", names: ["verwirrt", "confused", "unsicher", "frage"] },
  { emoji: "🙁", names: ["traurig", "sad", "ungluecklich"] },
  { emoji: "☹️", names: ["traurig", "sad", "ungluecklich", "frown"] },
  { emoji: "😣", names: ["anstrengend", "persevering", "schwierig"] },
  { emoji: "😖", names: ["frustriert", "confounded", "verzweifelt"] },
  { emoji: "😫", names: ["muede", "tired", "erschoeft", "anstrengend"] },
  { emoji: "😩", names: ["muede", "weary", "erschoeft", "frustriert"] },
  { emoji: "🥺", names: ["flehen", "pleading", "bitte", "hilfe"] },
  { emoji: "😢", names: ["weinen", "cry", "traurig", "traenen"] },
  { emoji: "😭", names: ["weinen", "sob", "traurig", "traenen"] },
  { emoji: "😤", names: ["triumph", "stolz", "erfolg", "gewinnen"] },
  { emoji: "😠", names: ["wuetend", "angry", "sauer", "frustriert"] },
  { emoji: "😡", names: ["wuetend", "rage", "sauer", "frustriert"] },
  { emoji: "🤬", names: ["fluchen", "cursing", "wuetend", "sauer"] },
  { emoji: "🤯", names: ["explodieren", "exploding", "ueberrascht", "wow"] },
  { emoji: "😳", names: ["ueberrascht", "flushed", "verlegen", "scham"] },
  { emoji: "🥵", names: ["heiss", "hot", "schwitzen", "temperatur"] },
  { emoji: "🥶", names: ["kalt", "cold", "frieren", "temperatur"] },
  { emoji: "😱", names: ["schreck", "scream", "angst", "panik"] },
  { emoji: "😨", names: ["angst", "fearful", "sorge", "nervoes"] },
  { emoji: "😰", names: ["angst", "anxious", "nervoes", "sorge"] },
  { emoji: "😥", names: ["enttaeuscht", "disappointed", "traurig"] },
  { emoji: "😓", names: ["schwitzen", "sweat", "anstrengend", "stress"] },
  { emoji: "🤗", names: ["umarmen", "hug", "liebe", "freundlich"] },
  { emoji: "🤔", names: ["nachdenken", "thinking", "ueberlegen", "frage"] },
  { emoji: "🤭", names: ["hand", "hand over mouth", "geheimnis", "spass"] },
  { emoji: "🤫", names: ["ruhe", "shushing", "leise", "geheimnis"] },
  { emoji: "🤥", names: ["luegen", "lying", "unwahr", "betrug"] },
  { emoji: "😶", names: ["keine worte", "no mouth", "stumm", "schweigen"] },
  { emoji: "😐", names: ["neutral", "neutral face", "gleichgueltig"] },
  { emoji: "😑", names: ["ausdrucklos", "expressionless", "langweilig"] },
  { emoji: "😬", names: ["grimasse", "grimacing", "unbehagen"] },
  { emoji: "🙄", names: ["augenrollen", "eye roll", "unglaube", "skeptisch"] },
  { emoji: "😯", names: ["ueberrascht", "surprised", "wow", "oh"] },
  { emoji: "😦", names: ["ueberrascht", "frowning", "traurig"] },
  { emoji: "😧", names: ["angst", "anguished", "sorge", "stress"] },
  { emoji: "😮", names: ["ueberrascht", "open mouth", "wow", "oh"] },
  { emoji: "😲", names: ["ueberrascht", "astonished", "wow", "unglaublich"] },
  { emoji: "🥱", names: ["gaehnen", "yawning", "muede", "langweilig"] },
  { emoji: "😴", names: ["schlafen", "sleeping", "muede", "ruhe"] },
  { emoji: "🤤", names: ["sabbern", "drooling", "hunger", "appetit"] },
  { emoji: "😪", names: ["muede", "sleepy", "erschoeft", "schlaf"] },
  { emoji: "😵", names: ["schwindlig", "dizzy", "uebel", "krank"] },
  { emoji: "🤐", names: ["mund", "zipper mouth", "geheimnis", "schweigen"] },
  { emoji: "🥴", names: ["betrunken", "woozy", "schwindlig", "krank"] },
  { emoji: "🤢", names: ["uebel", "nauseated", "krank", "schlecht"] },
  { emoji: "🤮", names: ["erbrechen", "vomiting", "uebel", "krank"] },
  { emoji: "🤧", names: ["niesen", "sneezing", "krank", "schnupfen"] },
  { emoji: "😷", names: ["maske", "mask", "krank", "gesundheit"] },
  { emoji: "🤒", names: ["fieber", "fever", "krank", "temperatur"] },
  { emoji: "🤕", names: ["verletzt", "injured", "kopf", "unfall"] },
  
  // Food & Drink - eine Auswahl der wichtigsten
  { emoji: "🍏", names: ["gruener apfel", "green apple", "apfel", "obst"] },
  { emoji: "🍎", names: ["roter apfel", "red apple", "apfel", "obst"] },
  { emoji: "🍐", names: ["birne", "pear", "obst", "frucht"] },
  { emoji: "🍊", names: ["orange", "tangerine", "obst", "frucht"] },
  { emoji: "🍋", names: ["zitrone", "lemon", "sauer", "frucht"] },
  { emoji: "🍌", names: ["banane", "banana", "obst", "frucht"] },
  { emoji: "🍉", names: ["wassermelone", "watermelon", "obst", "frucht"] },
  { emoji: "🍇", names: ["trauben", "grapes", "obst", "wein"] },
  { emoji: "🍓", names: ["erdbeere", "strawberry", "obst", "frucht"] },
  { emoji: "🫐", names: ["blaubeeren", "blueberries", "obst", "frucht"] },
  { emoji: "🍈", names: ["melone", "melon", "obst", "frucht"] },
  { emoji: "🍒", names: ["kirschen", "cherries", "obst", "frucht"] },
  { emoji: "🍑", names: ["pfirsich", "peach", "obst", "frucht"] },
  { emoji: "🥭", names: ["mango", "mango", "obst", "frucht"] },
  { emoji: "🍍", names: ["ananas", "pineapple", "obst", "frucht"] },
  { emoji: "🥥", names: ["kokosnuss", "coconut", "obst", "frucht"] },
  { emoji: "🥝", names: ["kiwi", "kiwi", "obst", "frucht"] },
  { emoji: "🍅", names: ["tomate", "tomato", "gemuese", "rot"] },
  { emoji: "🍆", names: ["aubergine", "eggplant", "gemuese", "lila"] },
  { emoji: "🥑", names: ["avocado", "avocado", "gemuese", "gesund"] },
  { emoji: "🥦", names: ["brokkoli", "broccoli", "gemuese", "gesund"] },
  { emoji: "🥬", names: ["blatt", "leafy greens", "gemuese", "salat"] },
  { emoji: "🥒", names: ["gurke", "cucumber", "gemuese", "salat"] },
  { emoji: "🌶", names: ["chili", "pepper", "scharf", "gewuerz"] },
  { emoji: "🫑", names: ["paprika", "bell pepper", "gemuese"] },
  { emoji: "🌽", names: ["mais", "corn", "gemuese", "gelb"] },
  { emoji: "🥕", names: ["karotte", "carrot", "gemuese", "orange"] },
  { emoji: "🫒", names: ["olive", "olive", "gemuese"] },
  { emoji: "🧄", names: ["knoblauch", "garlic", "gewuerz", "kueche"] },
  { emoji: "🧅", names: ["zwiebel", "onion", "gemuese", "kueche"] },
  { emoji: "🥔", names: ["kartoffel", "potato", "gemuese", "essen"] },
  { emoji: "🍠", names: ["suesskartoffel", "sweet potato", "gemuese"] },
  { emoji: "🥐", names: ["croissant", "croissant", "brot", "fruhstueck"] },
  { emoji: "🥯", names: ["bagel", "bagel", "brot", "fruhstueck"] },
  { emoji: "🍞", names: ["brot", "bread", "backen", "essen"] },
  { emoji: "🥖", names: ["baguette", "baguette", "brot", "frankreich"] },
  { emoji: "🥨", names: ["brezel", "pretzel", "brot", "snack"] },
  { emoji: "🧀", names: ["kaese", "cheese", "milchprodukt", "essen"] },
  { emoji: "🥚", names: ["ei", "egg", "fruhstueck", "protein"] },
  { emoji: "🍳", names: ["kochen", "cooking", "pfanne", "fruhstueck"] },
  { emoji: "🥞", names: ["pfannkuchen", "pancakes", "fruhstueck", "suess"] },
  { emoji: "🧇", names: ["waffel", "waffle", "fruhstueck", "suess"] },
  { emoji: "🥓", names: ["speck", "bacon", "fleisch", "fruhstueck"] },
  { emoji: "🥩", names: ["fleisch", "meat", "steak", "protein"] },
  { emoji: "🍗", names: ["huehnchen", "poultry leg", "fleisch", "protein"] },
  { emoji: "🍖", names: ["fleisch", "meat on bone", "fleisch", "protein"] },
  { emoji: "🦴", names: ["knochen", "bone", "fleisch"] },
  { emoji: "🌭", names: ["hotdog", "hot dog", "wurst", "fast food"] },
  { emoji: "🍔", names: ["burger", "hamburger", "fast food", "essen"] },
  { emoji: "🍟", names: ["pommes", "fries", "fast food", "snack"] },
  { emoji: "🍕", names: ["pizza", "pizza", "essen", "italien"] },
  { emoji: "🫓", names: ["fladenbrot", "flatbread", "brot"] },
  { emoji: "🥪", names: ["sandwich", "sandwich", "essen", "mahlzeit"] },
  { emoji: "🥙", names: ["wrap", "stuffed flatbread", "essen"] },
  { emoji: "🧆", names: ["falafel", "falafel", "essen", "vegetarisch"] },
  { emoji: "🌮", names: ["taco", "taco", "essen", "mexiko"] },
  { emoji: "🌯", names: ["burrito", "burrito", "essen", "mexiko"] },
  { emoji: "🫔", names: ["tamale", "tamale", "essen"] },
  { emoji: "🥗", names: ["salat", "salad", "essen", "gesund"] },
  { emoji: "🥘", names: ["topf", "shallow pan", "kochen", "essen"] },
  { emoji: "🫕", names: ["fondue", "fondue", "essen", "schweiz"] },
  { emoji: "🥣", names: ["schale", "bowl", "essen", "mahlzeit"] },
  { emoji: "🍝", names: ["spaghetti", "spaghetti", "pasta", "essen"] },
  { emoji: "🍜", names: ["nudeln", "steaming bowl", "nudeln", "essen"] },
  { emoji: "🍲", names: ["topf", "pot", "essen", "kochen"] },
  { emoji: "🍛", names: ["curry", "curry rice", "essen", "asien"] },
  { emoji: "🍣", names: ["sushi", "sushi", "essen", "japan"] },
  { emoji: "🍱", names: ["bento", "bento box", "essen", "japan"] },
  { emoji: "🥟", names: ["dumpling", "dumpling", "essen", "asien"] },
  { emoji: "🦪", names: ["austern", "oyster", "meeresfruechte"] },
  { emoji: "🍤", names: ["garnelen", "fried shrimp", "meeresfruechte"] },
  { emoji: "🍙", names: ["reisball", "rice ball", "essen", "japan"] },
  { emoji: "🍚", names: ["reis", "cooked rice", "essen", "asien"] },
  { emoji: "🍘", names: ["reis", "rice cracker", "snack", "japan"] },
  { emoji: "🍢", names: ["spiess", "oden", "essen", "japan"] },
  { emoji: "🍡", names: ["dango", "dango", "suess", "japan"] },
  { emoji: "🍧", names: ["eis", "shaved ice", "eis", "suess"] },
  { emoji: "🍨", names: ["eis", "ice cream", "eis", "suess"] },
  { emoji: "🍦", names: ["eis", "soft ice cream", "eis", "suess"] },
  { emoji: "🥧", names: ["kuchen", "pie", "kuchen", "suess"] },
  { emoji: "🧁", names: ["cupcake", "cupcake", "kuchen", "suess"] },
  { emoji: "🍰", names: ["kuchen", "cake", "geburtstag", "suess"] },
  { emoji: "🎂", names: ["geburtstagskuchen", "birthday cake", "geburtstag", "suess"] },
  { emoji: "🍮", names: ["pudding", "custard", "dessert", "suess"] },
  { emoji: "🍭", names: ["lollipop", "lollipop", "suessigkeiten", "suess"] },
  { emoji: "🍬", names: ["bonbon", "candy", "suessigkeiten", "suess"] },
  { emoji: "🍫", names: ["schokolade", "chocolate", "suessigkeiten", "suess"] },
  { emoji: "🍿", names: ["popcorn", "popcorn", "snack", "kino"] },
  { emoji: "🍩", names: ["donut", "doughnut", "kuchen", "suess"] },
  { emoji: "🍪", names: ["keks", "cookie", "kuchen", "suess"] },
  { emoji: "🌰", names: ["kastanie", "chestnut", "nuss", "herbst"] },
  { emoji: "🥜", names: ["nuesse", "peanuts", "nuss", "snack"] },
  { emoji: "🍯", names: ["honig", "honey", "suess", "natur"] },
  { emoji: "🥛", names: ["milch", "milk", "getraenk", "protein"] },
  { emoji: "☕️", names: ["kaffee", "coffee", "getraenk", "koffein"] },
  { emoji: "🫖", names: ["teekanne", "teapot", "tee", "getraenk"] },
  { emoji: "🍵", names: ["tee", "tea", "getraenk", "heiss"] },
  { emoji: "🍶", names: ["sake", "sake", "getraenk", "japan"] },
  { emoji: "🍺", names: ["bier", "beer", "alkohol", "getraenk"] },
  { emoji: "🍻", names: ["bier", "beers", "alkohol", "getraenk", "prost"] },
  { emoji: "🥂", names: ["champagner", "champagne", "alkohol", "feiern"] },
  { emoji: "🍷", names: ["wein", "wine", "alkohol", "getraenk"] },
  { emoji: "🥃", names: ["whiskey", "whiskey", "alkohol", "getraenk"] },
  { emoji: "🍸", names: ["cocktail", "cocktail", "alkohol", "getraenk"] },
  { emoji: "🍹", names: ["cocktail", "tropical drink", "alkohol", "getraenk"] },
  { emoji: "🧉", names: ["mate", "mate", "getraenk"] },
  { emoji: "🥤", names: ["getraenk", "cup with straw", "getraenk", "trinken"] },
  { emoji: "🧋", names: ["bubble tea", "bubble tea", "getraenk", "tee"] },
  { emoji: "🧃", names: ["getraenk", "beverage box", "getraenk", "saft"] },
  { emoji: "🧊", names: ["eis", "ice", "kalt", "wuerfel"] },
  
  // Activities & Sports
  { emoji: "⚽️", names: ["fussball", "soccer", "sport", "ball"] },
  { emoji: "🏀", names: ["basketball", "basketball", "sport", "ball"] },
  { emoji: "🏈", names: ["football", "american football", "sport", "ball"] },
  { emoji: "⚾️", names: ["baseball", "baseball", "sport", "ball"] },
  { emoji: "🥎", names: ["softball", "softball", "sport", "ball"] },
  { emoji: "🎾", names: ["tennis", "tennis", "sport", "ball"] },
  { emoji: "🏐", names: ["volleyball", "volleyball", "sport", "ball"] },
  { emoji: "🏉", names: ["rugby", "rugby", "sport", "ball"] },
  { emoji: "🎱", names: ["billard", "pool", "spiel", "ball"] },
  { emoji: "🏓", names: ["tischtennis", "ping pong", "sport", "ball"] },
  { emoji: "🏸", names: ["badminton", "badminton", "sport", "ball"] },
  { emoji: "🏒", names: ["eishockey", "hockey", "sport", "eis"] },
  { emoji: "🏑", names: ["hockey", "field hockey", "sport"] },
  { emoji: "🥍", names: ["lacrosse", "lacrosse", "sport"] },
  { emoji: "🏏", names: ["cricket", "cricket", "sport", "ball"] },
  { emoji: "⛳️", names: ["golf", "golf", "sport", "ball"] },
  { emoji: "🏹", names: ["bogenschiessen", "archery", "sport", "pfeil"] },
  { emoji: "🎣", names: ["angeln", "fishing", "sport", "fisch"] },
  { emoji: "🥊", names: ["boxen", "boxing", "sport", "kampf"] },
  { emoji: "🥋", names: ["kampfsport", "martial arts", "sport", "kampf"] },
  { emoji: "⛸", names: ["eislaufen", "ice skating", "sport", "eis"] },
  { emoji: "🎿", names: ["ski", "skiing", "sport", "winter"] },
  { emoji: "🛷", names: ["schlitten", "sled", "sport", "winter"] },
  { emoji: "🛹", names: ["skateboard", "skateboard", "sport", "skaten"] },
  { emoji: "🏋️", names: ["gewichte", "weight lifting", "sport", "training"] },
  { emoji: "🧗", names: ["klettern", "climbing", "sport", "berg"] },
  { emoji: "🏂", names: ["snowboard", "snowboard", "sport", "winter"] },
  { emoji: "🏌️", names: ["golf", "golfing", "sport"] },
  { emoji: "🏄", names: ["surfen", "surfing", "sport", "wasser"] },
  { emoji: "🏊", names: ["schwimmen", "swimming", "sport", "wasser"] },
  { emoji: "🚣", names: ["rudern", "rowing", "sport", "wasser"] },
  { emoji: "🏇", names: ["reiten", "horse racing", "sport", "pferd"] },
  { emoji: "🚴", names: ["fahrrad", "biking", "sport", "rad"] },
  { emoji: "🚵", names: ["mountainbike", "mountain biking", "sport", "rad"] },
  { emoji: "🧘", names: ["yoga", "yoga", "sport", "entspannung"] },
  { emoji: "🎮", names: ["spiel", "video game", "spiel", "unterhaltung"] },
  { emoji: "🕹", names: ["joystick", "joystick", "spiel", "controller"] },
  { emoji: "🎯", names: ["ziel", "dart", "spiel", "treffen"] },
  { emoji: "🧩", names: ["puzzle", "puzzle", "spiel", "denken"] },
  { emoji: "🎤", names: ["mikrofon", "microphone", "musik", "singen"] },
  { emoji: "🎧", names: ["kopfhoerer", "headphones", "musik", "hoeren"] },
  { emoji: "🎬", names: ["film", "movie camera", "film", "kamera"] },
  { emoji: "🎭", names: ["theater", "theater", "kunst", "kultur"] },
  
  // Objects - eine Auswahl der wichtigsten
  { emoji: "⌚️", names: ["uhr", "watch", "zeit", "armbanduhr"] },
  { emoji: "📱", names: ["handy", "phone", "telefon", "smartphone"] },
  { emoji: "💻", names: ["laptop", "laptop", "computer", "arbeit"] },
  { emoji: "⌨️", names: ["tastatur", "keyboard", "computer", "schreiben"] },
  { emoji: "🖥", names: ["computer", "desktop", "computer", "bildschirm"] },
  { emoji: "🖨", names: ["drucker", "printer", "computer", "drucken"] },
  { emoji: "🖱", names: ["maus", "mouse", "computer", "zeigen"] },
  { emoji: "📺", names: ["fernseher", "tv", "fernsehen", "unterhaltung"] },
  { emoji: "📷", names: ["kamera", "camera", "foto", "bild"] },
  { emoji: "📹", names: ["videokamera", "video camera", "video", "film"] },
  { emoji: "📼", names: ["videokassette", "videocassette", "video", "alt"] },
  { emoji: "🕯", names: ["kerze", "candle", "licht", "romantisch"] },
  { emoji: "💡", names: ["gluehbirne", "light bulb", "idee", "licht"] },
  { emoji: "🔦", names: ["taschenlampe", "flashlight", "licht", "dunkel"] },
  { emoji: "🏮", names: ["laterne", "lantern", "licht", "dekoration"] },
  { emoji: "📔", names: ["notizbuch", "notebook", "schreiben", "notizen"] },
  { emoji: "📕", names: ["buch", "closed book", "lesen", "buecher"] },
  { emoji: "📖", names: ["buch", "open book", "lesen", "buecher"] },
  { emoji: "📗", names: ["gruenes buch", "green book", "lesen", "buecher"] },
  { emoji: "📘", names: ["blaues buch", "blue book", "lesen", "buecher"] },
  { emoji: "📙", names: ["oranges buch", "orange book", "lesen", "buecher"] },
  { emoji: "📚", names: ["buecher", "books", "lesen", "bildung"] },
  { emoji: "📓", names: ["notizbuch", "notebook", "schreiben", "notizen"] },
  { emoji: "📒", names: ["heft", "ledger", "schreiben", "notizen"] },
  { emoji: "📃", names: ["seite", "page", "papier", "dokument"] },
  { emoji: "📜", names: ["rolle", "scroll", "papier", "alt"] },
  { emoji: "📄", names: ["seite", "page facing up", "papier", "dokument"] },
  { emoji: "📰", names: ["zeitung", "newspaper", "nachrichten", "lesen"] },
  { emoji: "🗞", names: ["zeitung", "rolled up newspaper", "nachrichten"] },
  { emoji: "📑", names: ["bookmark", "bookmark tabs", "lesen", "markieren"] },
  { emoji: "🔖", names: ["lesezeichen", "bookmark", "lesen", "markieren"] },
  { emoji: "🏷", names: ["etikett", "label", "markieren", "preis"] },
  { emoji: "💰", names: ["geld", "money bag", "geld", "reichtum"] },
  { emoji: "💴", names: ["yen", "yen banknote", "geld", "japan"] },
  { emoji: "💵", names: ["dollar", "dollar banknote", "geld", "usa"] },
  { emoji: "💶", names: ["euro", "euro banknote", "geld", "europa"] },
  { emoji: "💷", names: ["pfund", "pound banknote", "geld", "england"] },
  { emoji: "💸", names: ["geld", "money with wings", "geld", "ausgeben"] },
  { emoji: "💳", names: ["kreditkarte", "credit card", "geld", "bezahlen"] },
  { emoji: "🧾", names: ["quittung", "receipt", "geld", "kauf"] },
  { emoji: "✉️", names: ["brief", "envelope", "post", "nachricht"] },
  { emoji: "📧", names: ["email", "email", "post", "nachricht"] },
  { emoji: "📨", names: ["brief", "incoming envelope", "post", "nachricht"] },
  { emoji: "📩", names: ["brief", "envelope with arrow", "post", "nachricht"] },
  { emoji: "📤", names: ["ausgehend", "outbox tray", "post", "senden"] },
  { emoji: "📥", names: ["eingehend", "inbox tray", "post", "empfangen"] },
  { emoji: "📦", names: ["paket", "package", "post", "versand"] },
  { emoji: "📫", names: ["briefkasten", "mailbox", "post", "brief"] },
  { emoji: "📪", names: ["briefkasten", "closed mailbox", "post"] },
  { emoji: "📬", names: ["briefkasten", "open mailbox", "post"] },
  { emoji: "📭", names: ["briefkasten", "mailbox with flag down", "post"] },
  { emoji: "📮", names: ["briefkasten", "postbox", "post", "brief"] },
  { emoji: "🗳", names: ["wahlurne", "ballot box", "wahl", "demokratie"] },
  { emoji: "✏️", names: ["bleistift", "pencil", "schreiben", "zeichnen"] },
  { emoji: "✒️", names: ["feder", "black nib", "schreiben", "stift"] },
  { emoji: "🖊", names: ["kugelschreiber", "pen", "schreiben", "stift"] },
  { emoji: "🖋", names: ["feder", "fountain pen", "schreiben", "stift"] },
  { emoji: "🖌", names: ["pinsel", "paintbrush", "malen", "kunst"] },
  { emoji: "🖍", names: ["buntstift", "crayon", "malen", "kunst"] },
  { emoji: "📝", names: ["notizen", "memo", "schreiben", "notizen"] },
  { emoji: "📁", names: ["ordner", "file folder", "dokument", "organisation"] },
  { emoji: "📂", names: ["ordner", "open file folder", "dokument", "organisation"] },
  { emoji: "📅", names: ["kalender", "calendar", "datum", "termin"] },
  { emoji: "📆", names: ["kalender", "tear off calendar", "datum", "termin"] },
  { emoji: "🗓", names: ["kalender", "spiral calendar", "datum", "termin"] },
  { emoji: "📇", names: ["karteikarte", "card index", "organisation", "karte"] },
  { emoji: "📈", names: ["diagramm", "chart increasing", "statistik", "wachstum"] },
  { emoji: "📉", names: ["diagramm", "chart decreasing", "statistik", "rückgang"] },
  { emoji: "📊", names: ["diagramm", "bar chart", "statistik", "daten"] },
  { emoji: "📋", names: ["clipboard", "clipboard", "organisation", "liste"] },
  { emoji: "📌", names: ["pushpin", "pushpin", "markieren", "befestigen"] },
  { emoji: "📍", names: ["markierung", "round pushpin", "ort", "karte"] },
  { emoji: "📎", names: ["klammer", "paperclip", "befestigen", "organisation"] },
  { emoji: "🖇", names: ["klammer", "linked paperclips", "befestigen"] },
  { emoji: "📏", names: ["lineal", "ruler", "messen", "werkzeug"] },
  { emoji: "📐", names: ["dreieck", "triangular ruler", "messen", "werkzeug"] },
  { emoji: "✂️", names: ["schere", "scissors", "schneiden", "werkzeug"] },
  { emoji: "🗃", names: ["karteikasten", "card file box", "organisation"] },
  { emoji: "🗄", names: ["schrank", "file cabinet", "organisation", "archiv"] },
  { emoji: "🗑", names: ["muell", "wastebasket", "loeschen", "aufraeumen"] },
  { emoji: "🔒", names: ["schloss", "locked", "sicherheit", "verschlossen"] },
  { emoji: "🔓", names: ["offen", "unlocked", "sicherheit", "offen"] },
  { emoji: "🔏", names: ["schloss", "locked with key", "sicherheit"] },
  { emoji: "🔐", names: ["schloss", "locked with pen", "sicherheit"] },
  { emoji: "🔑", names: ["schluessel", "key", "sicherheit", "oeffnen"] },
  { emoji: "🗝", names: ["schluessel", "old key", "sicherheit", "alt"] },
  { emoji: "🔨", names: ["hammer", "hammer", "werkzeug", "bauen"] },
  { emoji: "🪓", names: ["axt", "axe", "werkzeug", "holz"] },
  { emoji: "⛏", names: ["spitzhacke", "pick", "werkzeug", "bauen"] },
  { emoji: "⚒", names: ["hammer", "hammer and pick", "werkzeug"] },
  { emoji: "🛠", names: ["werkzeug", "hammer and wrench", "werkzeug", "reparieren"] },
  { emoji: "🗡", names: ["dolch", "dagger", "waffe", "kampf"] },
  { emoji: "⚔️", names: ["schwerter", "crossed swords", "waffe", "kampf"] },
  { emoji: "🔫", names: ["pistole", "gun", "waffe", "spiel"] },
  { emoji: "🛡", names: ["schild", "shield", "schutz", "kampf"] },
  { emoji: "🔧", names: ["schraubenschluessel", "wrench", "werkzeug", "reparieren"] },
  { emoji: "🔩", names: ["schraube", "nut and bolt", "werkzeug", "reparieren"] },
  { emoji: "⚙️", names: ["zahnrad", "gear", "werkzeug", "mechanik"] },
  { emoji: "🗜", names: ["zwinge", "clamp", "werkzeug", "befestigen"] },
  { emoji: "⚖️", names: ["waage", "balance scale", "gerechtigkeit", "recht"] },
  { emoji: "🦯", names: ["stock", "probing cane", "hilfe", "blind"] },
  { emoji: "🔗", names: ["kette", "link", "verbinden", "internet"] },
  { emoji: "⛓", names: ["kette", "chains", "verbinden", "gefangen"] },
  { emoji: "🧰", names: ["werkzeugkasten", "toolbox", "werkzeug", "reparieren"] },
  { emoji: "🧲", names: ["magnet", "magnet", "physik", "anziehen"] },
  { emoji: "🧪", names: ["reagenzglas", "test tube", "wissenschaft", "experiment"] },
  { emoji: "🧫", names: ["petrischale", "petri dish", "wissenschaft", "experiment"] },
  { emoji: "🧬", names: ["dna", "dna", "wissenschaft", "biologie"] },
  { emoji: "🔬", names: ["mikroskop", "microscope", "wissenschaft", "forschen"] },
  { emoji: "🔭", names: ["teleskop", "telescope", "wissenschaft", "stern"] },
  { emoji: "📡", names: ["satellit", "satellite", "technik", "kommunikation"] },
  { emoji: "💉", names: ["spritze", "syringe", "medizin", "impfung"] },
  { emoji: "🩸", names: ["blut", "drop of blood", "medizin", "gesundheit"] },
  { emoji: "💊", names: ["pille", "pill", "medizin", "gesundheit"] },
  { emoji: "🩹", names: ["pflaster", "adhesive bandage", "medizin", "verletzung"] },
  { emoji: "🩺", names: ["stethoskop", "stethoscope", "medizin", "arzt"] },
  { emoji: "🚪", names: ["tuer", "door", "haus", "eingang"] },
  { emoji: "🛌", names: ["bett", "bed", "schlafen", "ruhe"] },
  { emoji: "🛋", names: ["sofa", "couch", "wohnen", "möbel"] },
  { emoji: "🪑", names: ["stuhl", "chair", "wohnen", "möbel"] },
  { emoji: "🚽", names: ["toilette", "toilet", "badezimmer", "hygiene"] },
  { emoji: "🚿", names: ["dusche", "shower", "badezimmer", "hygiene"] },
  { emoji: "🛁", names: ["badewanne", "bathtub", "badezimmer", "hygiene"] },
  { emoji: "🪒", names: ["rasierer", "razor", "hygiene", "rasieren"] },
  { emoji: "🧴", names: ["flasche", "lotion bottle", "hygiene", "kosmetik"] },
  { emoji: "🧼", names: ["seife", "soap", "hygiene", "sauber"] },
  { emoji: "🧹", names: ["besen", "broom", "putzen", "sauber"] },
  { emoji: "🧺", names: ["korb", "basket", "organisation", "wäsche"] },
  { emoji: "🧻", names: ["papier", "roll of paper", "hygiene", "toilette"] },
  { emoji: "🛀", names: ["bad", "person taking bath", "hygiene", "entspannung"] },
  { emoji: "🪣", names: ["eimer", "bucket", "putzen", "wasser"] },
  { emoji: "🪥", names: ["zahnbuerste", "toothbrush", "hygiene", "zaehne"] },
  { emoji: "🪞", names: ["spiegel", "mirror", "badezimmer", "schönheit"] },
  { emoji: "🪟", names: ["fenster", "window", "haus", "licht"] },
  
  // Nature - eine Auswahl der wichtigsten
  { emoji: "🐶", names: ["hund", "dog", "tier", "haustier"] },
  { emoji: "🐱", names: ["katze", "cat", "tier", "haustier"] },
  { emoji: "🐭", names: ["maus", "mouse", "tier", "nager"] },
  { emoji: "🐹", names: ["hamster", "hamster", "tier", "haustier"] },
  { emoji: "🐰", names: ["hase", "rabbit", "tier", "niedlich"] },
  { emoji: "🦊", names: ["fuchs", "fox", "tier", "wild"] },
  { emoji: "🐻", names: ["baer", "bear", "tier", "wild"] },
  { emoji: "🐼", names: ["panda", "panda", "tier", "niedlich"] },
  { emoji: "🐨", names: ["koala", "koala", "tier", "australien"] },
  { emoji: "🐯", names: ["tiger", "tiger", "tier", "wild"] },
  { emoji: "🦁", names: ["loewe", "lion", "tier", "wild"] },
  { emoji: "🐮", names: ["kuh", "cow", "tier", "bauernhof"] },
  { emoji: "🐷", names: ["schwein", "pig", "tier", "bauernhof"] },
  { emoji: "🐸", names: ["frosch", "frog", "tier", "amphibie"] },
  { emoji: "🐵", names: ["affe", "monkey", "tier", "wild"] },
  { emoji: "🐒", names: ["affe", "monkey", "tier", "wild"] },
  { emoji: "🐔", names: ["huhn", "chicken", "tier", "bauernhof"] },
  { emoji: "🐧", names: ["pinguin", "penguin", "tier", "eis"] },
  { emoji: "🐦", names: ["vogel", "bird", "tier", "fliegen"] },
  { emoji: "🐤", names: ["kueken", "baby chick", "tier", "niedlich"] },
  { emoji: "🐣", names: ["kueken", "hatching chick", "tier", "niedlich"] },
  { emoji: "🐥", names: ["kueken", "front facing baby chick", "tier"] },
  { emoji: "🦆", names: ["ente", "duck", "tier", "wasser"] },
  { emoji: "🦢", names: ["schwan", "swan", "tier", "wasser"] },
  { emoji: "🦉", names: ["eule", "owl", "tier", "nacht"] },
  { emoji: "🦚", names: ["pfau", "peacock", "tier", "schön"] },
  { emoji: "🦜", names: ["papagei", "parrot", "tier", "sprechen"] },
  { emoji: "🐺", names: ["wolf", "wolf", "tier", "wild"] },
  { emoji: "🐗", names: ["wildschwein", "boar", "tier", "wild"] },
  { emoji: "🐴", names: ["pferd", "horse", "tier", "reiten"] },
  { emoji: "🦄", names: ["einhorn", "unicorn", "tier", "fantasie"] },
  { emoji: "🐝", names: ["biene", "bee", "insekt", "honig"] },
  { emoji: "🐛", names: ["raupe", "bug", "insekt", "natur"] },
  { emoji: "🦋", names: ["schmetterling", "butterfly", "insekt", "schön"] },
  { emoji: "🐌", names: ["schnecke", "snail", "tier", "langsam"] },
  { emoji: "🐞", names: ["maarienkaefer", "lady beetle", "insekt", "niedlich"] },
  { emoji: "🐜", names: ["ameise", "ant", "insekt", "arbeit"] },
  { emoji: "🦗", names: ["grille", "cricket", "insekt", "musik"] },
  { emoji: "🕷", names: ["spinne", "spider", "insekt", "netz"] },
  { emoji: "🕸", names: ["spinnennetz", "spider web", "insekt", "netz"] },
  { emoji: "🐢", names: ["schildkroete", "turtle", "tier", "langsam"] },
  { emoji: "🐍", names: ["schlange", "snake", "tier", "wild"] },
  { emoji: "🦎", names: ["echse", "lizard", "tier", "reptil"] },
  { emoji: "🦖", names: ["t-rex", "t-rex", "dinosaurier", "ausgestorben"] },
  { emoji: "🦕", names: ["sauropod", "sauropod", "dinosaurier", "ausgestorben"] },
  { emoji: "🐙", names: ["krake", "octopus", "tier", "meer"] },
  { emoji: "🦑", names: ["tintenfisch", "squid", "tier", "meer"] },
  { emoji: "🦐", names: ["garnele", "shrimp", "tier", "meer"] },
  { emoji: "🦞", names: ["hummer", "lobster", "tier", "meer"] },
  { emoji: "🦀", names: ["krebs", "crab", "tier", "meer"] },
  { emoji: "🐡", names: ["kugelfisch", "blowfish", "tier", "meer"] },
  { emoji: "🐠", names: ["fisch", "tropical fish", "tier", "meer"] },
  { emoji: "🐟", names: ["fisch", "fish", "tier", "meer"] },
  { emoji: "🐬", names: ["delfin", "dolphin", "tier", "meer"] },
  { emoji: "🐳", names: ["wal", "whale", "tier", "meer"] },
  { emoji: "🐋", names: ["wal", "whale", "tier", "meer"] },
  { emoji: "🦈", names: ["hai", "shark", "tier", "meer"] },
  { emoji: "🐊", names: ["krokodil", "crocodile", "tier", "wild"] },
  { emoji: "🐅", names: ["tiger", "tiger", "tier", "wild"] },
  { emoji: "🐆", names: ["leopard", "leopard", "tier", "wild"] },
  { emoji: "🦓", names: ["zebra", "zebra", "tier", "wild"] },
  { emoji: "🦍", names: ["gorilla", "gorilla", "tier", "wild"] },
  { emoji: "🐘", names: ["elefant", "elephant", "tier", "wild"] },
  { emoji: "🦛", names: ["nilpferd", "hippopotamus", "tier", "wild"] },
  { emoji: "🦏", names: ["nashorn", "rhinoceros", "tier", "wild"] },
  { emoji: "🐪", names: ["kamel", "camel", "tier", "wüste"] },
  { emoji: "🐫", names: ["kamel", "two hump camel", "tier", "wüste"] },
  { emoji: "🦒", names: ["giraffe", "giraffe", "tier", "wild"] },
  { emoji: "🦘", names: ["känguru", "kangaroo", "tier", "australien"] },
  { emoji: "🐃", names: ["wasserbüffel", "water buffalo", "tier", "bauernhof"] },
  { emoji: "🐂", names: ["ochse", "ox", "tier", "bauernhof"] },
  { emoji: "🐄", names: ["kuh", "cow", "tier", "bauernhof"] },
  { emoji: "🐎", names: ["pferd", "horse", "tier", "reiten"] },
  { emoji: "🐖", names: ["schwein", "pig", "tier", "bauernhof"] },
  { emoji: "🐏", names: ["widder", "ram", "tier", "bauernhof"] },
  { emoji: "🐑", names: ["schaf", "ewe", "tier", "bauernhof"] },
  { emoji: "🐐", names: ["ziege", "goat", "tier", "bauernhof"] },
  { emoji: "🦌", names: ["hirsch", "deer", "tier", "wild"] },
  { emoji: "🐕", names: ["hund", "dog", "tier", "haustier"] },
  { emoji: "🐩", names: ["hund", "poodle", "tier", "haustier"] },
  { emoji: "🐈", names: ["katze", "cat", "tier", "haustier"] },
  { emoji: "🐓", names: ["hahn", "rooster", "tier", "bauernhof"] },
  { emoji: "🦃", names: ["truthahn", "turkey", "tier", "bauernhof"] },
  { emoji: "🕊", names: ["taube", "dove", "tier", "frieden"] },
  { emoji: "🐇", names: ["hase", "rabbit", "tier", "niedlich"] },
  { emoji: "🐁", names: ["maus", "mouse", "tier", "nager"] },
  { emoji: "🐀", names: ["ratte", "rat", "tier", "nager"] },
  { emoji: "🐿", names: ["eichhoernchen", "chipmunk", "tier", "niedlich"] },
  { emoji: "🐾", names: ["pfoten", "paw prints", "tier", "spuren"] },
  { emoji: "🐉", names: ["drache", "dragon", "fantasie", "mythologie"] },
  { emoji: "🐲", names: ["drache", "dragon face", "fantasie", "mythologie"] },
  { emoji: "🌵", names: ["kaktus", "cactus", "pflanze", "wüste"] },
  { emoji: "🎄", names: ["weihnachtsbaum", "christmas tree", "pflanze", "weihnachten"] },
  { emoji: "🌲", names: ["tanne", "evergreen tree", "pflanze", "wald"] },
  { emoji: "🌳", names: ["baum", "deciduous tree", "pflanze", "wald"] },
  { emoji: "🌴", names: ["palme", "palm tree", "pflanze", "strand"] },
  { emoji: "🌱", names: ["spross", "seedling", "pflanze", "wachsen"] },
  { emoji: "🌿", names: ["kraut", "herb", "pflanze", "kueche"] },
  { emoji: "☘️", names: ["kleeblatt", "shamrock", "pflanze", "irland"] },
  { emoji: "🍀", names: ["kleeblatt", "four leaf clover", "pflanze", "glück"] },
  { emoji: "🎍", names: ["tanabata", "tanabata tree", "pflanze", "japan"] },
  { emoji: "🎋", names: ["bambus", "bamboo", "pflanze", "japan"] },
  { emoji: "🍃", names: ["blatt", "leaf fluttering", "pflanze", "wind"] },
  { emoji: "🍂", names: ["laub", "fallen leaf", "pflanze", "herbst"] },
  { emoji: "🍁", names: ["ahorn", "maple leaf", "pflanze", "herbst"] },
  { emoji: "🍄", names: ["pilz", "mushroom", "pflanze", "natur"] },
  { emoji: "🌾", names: ["reis", "sheaf of rice", "pflanze", "getreide"] },
  { emoji: "💐", names: ["blumen", "bouquet", "blume", "geschenk"] },
  { emoji: "🌷", names: ["tulpe", "tulip", "blume", "fruehling"] },
  { emoji: "🌹", names: ["rose", "rose", "blume", "liebe"] },
  { emoji: "🥀", names: ["welke rose", "wilted flower", "blume", "traurig"] },
  { emoji: "🌺", names: ["hibiskus", "hibiscus", "blume", "tropen"] },
  { emoji: "🌸", names: ["kirschbluete", "cherry blossom", "blume", "fruehling"] },
  { emoji: "🌼", names: ["bluete", "blossom", "blume", "fruehling"] },
  { emoji: "🌻", names: ["sonnenblume", "sunflower", "blume", "sonne"] },
  { emoji: "🌞", names: ["sonne", "sun with face", "himmel", "wetter"] },
  { emoji: "🌝", names: ["vollmond", "full moon face", "mond", "nacht"] },
  { emoji: "🌛", names: ["halbmond", "first quarter moon face", "mond"] },
  { emoji: "🌜", names: ["halbmond", "last quarter moon face", "mond"] },
  { emoji: "🌚", names: ["neumond", "new moon face", "mond", "nacht"] },
  { emoji: "🌕", names: ["vollmond", "full moon", "mond", "nacht"] },
  { emoji: "🌖", names: ["mond", "waning gibbous moon", "mond"] },
  { emoji: "🌗", names: ["halbmond", "last quarter moon", "mond"] },
  { emoji: "🌘", names: ["mond", "waning crescent moon", "mond"] },
  { emoji: "🌑", names: ["neumond", "new moon", "mond", "nacht"] },
  { emoji: "🌒", names: ["mond", "waxing crescent moon", "mond"] },
  { emoji: "🌓", names: ["halbmond", "first quarter moon", "mond"] },
  { emoji: "🌔", names: ["mond", "waxing gibbous moon", "mond"] },
  { emoji: "🌙", names: ["mond", "crescent moon", "mond", "nacht"] },
  { emoji: "🌎", names: ["erde", "earth americas", "planet", "welt"] },
  { emoji: "🌍", names: ["erde", "earth europe africa", "planet", "welt"] },
  { emoji: "🌏", names: ["erde", "earth asia australia", "planet", "welt"] },
  { emoji: "🪐", names: ["saturn", "ringed planet", "planet", "weltraum"] },
  { emoji: "💫", names: ["stern", "dizzy", "stern", "magie"] },
  { emoji: "⭐️", names: ["stern", "star", "stern", "bewertung"] },
  { emoji: "🌟", names: ["stern", "glowing star", "stern", "glanz"] },
  { emoji: "✨", names: ["stern", "sparkles", "glitzer", "magie"] },
  { emoji: "⚡️", names: ["blitz", "lightning", "energie", "gewitter"] },
  { emoji: "☄️", names: ["komet", "comet", "weltraum", "himmel"] },
  { emoji: "💥", names: ["explosion", "collision", "energie", "gewalt"] },
  { emoji: "🔥", names: ["feuer", "fire", "heiss", "energie"] },
  { emoji: "🌪", names: ["wirbelsturm", "tornado", "wetter", "sturm"] },
  { emoji: "🌈", names: ["regenbogen", "rainbow", "wetter", "farben"] },
  { emoji: "☀️", names: ["sonne", "sun", "wetter", "hell"] },
  { emoji: "🌤", names: ["sonne", "sun behind small cloud", "wetter"] },
  { emoji: "⛅️", names: ["wolken", "sun behind cloud", "wetter", "bewoelkt"] },
  { emoji: "🌥", names: ["wolken", "sun behind large cloud", "wetter"] },
  { emoji: "☁️", names: ["wolke", "cloud", "wetter", "bewoelkt"] },
  { emoji: "🌦", names: ["regen", "sun behind rain cloud", "wetter"] },
  { emoji: "🌧", names: ["regen", "cloud with rain", "wetter", "nass"] },
  { emoji: "⛈", names: ["gewitter", "cloud with lightning and rain", "wetter", "sturm"] },
  { emoji: "🌩", names: ["blitz", "cloud with lightning", "wetter", "gewitter"] },
  { emoji: "🌨", names: ["schnee", "cloud with snow", "wetter", "kalt"] },
  { emoji: "❄️", names: ["schneeflocke", "snowflake", "wetter", "winter"] },
  { emoji: "☃️", names: ["schneemann", "snowman", "wetter", "winter"] },
  { emoji: "⛄️", names: ["schneemann", "snowman without snow", "wetter", "winter"] },
  { emoji: "🌬", names: ["wind", "wind face", "wetter", "luft"] },
  { emoji: "💨", names: ["wind", "dashing away", "wetter", "schnell"] },
  { emoji: "💧", names: ["tropfen", "droplet", "wasser", "regen"] },
  { emoji: "💦", names: ["schweiss", "sweat droplets", "wasser", "anstrengend"] },
  { emoji: "☔️", names: ["regenschirm", "umbrella with rain", "wetter", "regen"] },
  { emoji: "☂️", names: ["regenschirm", "umbrella", "wetter", "regen"] },
  { emoji: "🌊", names: ["welle", "water wave", "wasser", "meer"] },
  { emoji: "🌫", names: ["nebel", "fog", "wetter", "dunst"] },
  
  // Transport & Places
  { emoji: "🚗", names: ["auto", "car", "fahrzeug", "transport"] },
  { emoji: "🚕", names: ["taxi", "taxi", "fahrzeug", "transport"] },
  { emoji: "🚙", names: ["suv", "suv", "fahrzeug", "transport"] },
  { emoji: "🚌", names: ["bus", "bus", "fahrzeug", "transport", "oeffentlich"] },
  { emoji: "🚎", names: ["trolleybus", "trolleybus", "fahrzeug", "transport"] },
  { emoji: "🏎", names: ["rennauto", "racing car", "fahrzeug", "sport"] },
  { emoji: "🚓", names: ["polizei", "police car", "fahrzeug", "polizei"] },
  { emoji: "🚑", names: ["krankenwagen", "ambulance", "fahrzeug", "rettung"] },
  { emoji: "🚒", names: ["feuerwehr", "fire engine", "fahrzeug", "rettung"] },
  { emoji: "🚐", names: ["van", "van", "fahrzeug", "transport"] },
  { emoji: "🛻", names: ["pickup", "pickup truck", "fahrzeug", "transport"] },
  { emoji: "🚚", names: ["laster", "delivery truck", "fahrzeug", "transport"] },
  { emoji: "🚛", names: ["lkw", "articulated lorry", "fahrzeug", "transport"] },
  { emoji: "🚜", names: ["traktor", "tractor", "fahrzeug", "landwirtschaft"] },
  { emoji: "🏍", names: ["motorrad", "motorcycle", "fahrzeug", "transport"] },
  { emoji: "🛵", names: ["roller", "motor scooter", "fahrzeug", "transport"] },
  { emoji: "🦽", names: ["rollstuhl", "manual wheelchair", "hilfe", "behinderung"] },
  { emoji: "🦼", names: ["elektrorollstuhl", "motorized wheelchair", "hilfe"] },
  { emoji: "🛴", names: ["tretroller", "kick scooter", "fahrzeug", "transport"] },
  { emoji: "🚲", names: ["fahrrad", "bicycle", "fahrzeug", "transport", "sport"] },
  { emoji: "🛴", names: ["scooter", "scooter", "fahrzeug", "transport"] },
  { emoji: "🛹", names: ["skateboard", "skateboard", "fahrzeug", "sport"] },
  { emoji: "🛼", names: ["roller", "roller skate", "fahrzeug", "sport"] },
  { emoji: "🚁", names: ["helikopter", "helicopter", "flugzeug", "luft"] },
  { emoji: "✈️", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛩", names: ["kleines flugzeug", "small airplane", "flugzeug"] },
  { emoji: "🛫", names: ["abflug", "airplane departure", "flugzeug", "reisen"] },
  { emoji: "🛬", names: ["ankunft", "airplane arrival", "flugzeug", "reisen"] },
  { emoji: "🪂", names: ["fallschirm", "parachute", "sport", "luft"] },
  { emoji: "💺", names: ["sitz", "seat", "flugzeug", "reisen"] },
  { emoji: "🚀", names: ["rakete", "rocket", "weltraum", "technik"] },
  { emoji: "🛸", names: ["ufo", "flying saucer", "weltraum", "fantasie"] },
  { emoji: "🚂", names: ["lokomotive", "locomotive", "zug", "transport"] },
  { emoji: "🚃", names: ["zug", "railway car", "zug", "transport"] },
  { emoji: "🚄", names: ["hochgeschwindigkeitszug", "high speed train", "zug", "transport"] },
  { emoji: "🚅", names: ["bullet train", "bullet train", "zug", "transport"] },
  { emoji: "🚆", names: ["zug", "train", "zug", "transport"] },
  { emoji: "🚇", names: ["u-bahn", "metro", "zug", "transport", "stadt"] },
  { emoji: "🚈", names: ["bahn", "light rail", "zug", "transport"] },
  { emoji: "🚉", names: ["bahnhof", "station", "zug", "transport"] },
  { emoji: "🚊", names: ["strassenbahn", "tram", "zug", "transport"] },
  { emoji: "🚝", names: ["monorail", "monorail", "zug", "transport"] },
  { emoji: "🚞", names: ["bergbahn", "mountain railway", "zug", "transport"] },
  { emoji: "🚋", names: ["tram", "tram car", "zug", "transport"] },
  { emoji: "🚌", names: ["bus", "bus", "fahrzeug", "transport"] },
  { emoji: "🚍", names: ["bus", "oncoming bus", "fahrzeug", "transport"] },
  { emoji: "🚎", names: ["trolleybus", "trolleybus", "fahrzeug", "transport"] },
  { emoji: "🚐", names: ["minibus", "minibus", "fahrzeug", "transport"] },
  { emoji: "🚑", names: ["ambulance", "ambulance", "fahrzeug", "rettung"] },
  { emoji: "🚒", names: ["feuerwehr", "fire engine", "fahrzeug", "rettung"] },
  { emoji: "🚓", names: ["polizei", "police car", "fahrzeug", "polizei"] },
  { emoji: "🚔", names: ["polizei", "oncoming police car", "fahrzeug", "polizei"] },
  { emoji: "🚕", names: ["taxi", "taxi", "fahrzeug", "transport"] },
  { emoji: "🚖", names: ["taxi", "oncoming taxi", "fahrzeug", "transport"] },
  { emoji: "🚗", names: ["auto", "automobile", "fahrzeug", "transport"] },
  { emoji: "🚘", names: ["auto", "oncoming automobile", "fahrzeug", "transport"] },
  { emoji: "🚙", names: ["suv", "sport utility vehicle", "fahrzeug", "transport"] },
  { emoji: "🚚", names: ["laster", "delivery truck", "fahrzeug", "transport"] },
  { emoji: "🚛", names: ["lkw", "articulated lorry", "fahrzeug", "transport"] },
  { emoji: "🚜", names: ["traktor", "tractor", "fahrzeug", "landwirtschaft"] },
  { emoji: "🏎", names: ["rennauto", "racing car", "fahrzeug", "sport"] },
  { emoji: "🏍", names: ["motorrad", "motorcycle", "fahrzeug", "transport"] },
  { emoji: "🛵", names: ["roller", "motor scooter", "fahrzeug", "transport"] },
  { emoji: "🦽", names: ["rollstuhl", "manual wheelchair", "hilfe", "behinderung"] },
  { emoji: "🦼", names: ["elektrorollstuhl", "motorized wheelchair", "hilfe"] },
  { emoji: "🛴", names: ["tretroller", "kick scooter", "fahrzeug", "transport"] },
  { emoji: "🚲", names: ["fahrrad", "bicycle", "fahrzeug", "transport", "sport"] },
  { emoji: "🛴", names: ["scooter", "scooter", "fahrzeug", "transport"] },
  { emoji: "🛹", names: ["skateboard", "skateboard", "fahrzeug", "sport"] },
  { emoji: "🛼", names: ["roller", "roller skate", "fahrzeug", "sport"] },
  { emoji: "🚁", names: ["helikopter", "helicopter", "flugzeug", "luft"] },
  { emoji: "🛸", names: ["ufo", "flying saucer", "weltraum", "fantasie"] },
  { emoji: "🚀", names: ["rakete", "rocket", "weltraum", "technik"] },
  { emoji: "✈️", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛩", names: ["kleines flugzeug", "small airplane", "flugzeug"] },
  { emoji: "🛫", names: ["abflug", "airplane departure", "flugzeug", "reisen"] },
  { emoji: "🛬", names: ["ankunft", "airplane arrival", "flugzeug", "reisen"] },
  { emoji: "🪂", names: ["fallschirm", "parachute", "sport", "luft"] },
  { emoji: "💺", names: ["sitz", "seat", "flugzeug", "reisen"] },
  { emoji: "🚢", names: ["schiff", "ship", "schiff", "meer", "reisen"] },
  { emoji: "⛴", names: ["faehre", "ferry", "schiff", "transport"] },
  { emoji: "🛥", names: ["motorboot", "motor boat", "schiff", "meer"] },
  { emoji: "🛳", names: ["passagierschiff", "passenger ship", "schiff", "reisen"] },
  { emoji: "⛵", names: ["segelboot", "sailboat", "schiff", "sport"] },
  { emoji: "🚤", names: ["speedboot", "speedboat", "schiff", "schnell"] },
  { emoji: "🛶", names: ["kanu", "canoe", "schiff", "sport"] },
  { emoji: "🚣", names: ["rudern", "rowing boat", "schiff", "sport"] },
  { emoji: "🛟", names: ["rettungsring", "ring buoy", "rettung", "wasser"] },
  { emoji: "⛽", names: ["tankstelle", "fuel pump", "auto", "tanken"] },
  { emoji: "🚨", names: ["polizei", "police car light", "polizei", "warnung"] },
  { emoji: "🚥", names: ["ampel", "horizontal traffic light", "verkehr", "ampel"] },
  { emoji: "🚦", names: ["ampel", "vertical traffic light", "verkehr", "ampel"] },
  { emoji: "🛑", names: ["stoppschild", "stop sign", "verkehr", "stopp"] },
  { emoji: "🚧", names: ["baustelle", "construction", "verkehr", "bauen"] },
  
  // Buildings & Places
  { emoji: "🏠", names: ["haus", "house", "gebaeude", "wohnen"] },
  { emoji: "🏡", names: ["haus", "house with garden", "gebaeude", "wohnen"] },
  { emoji: "🏢", names: ["buero", "office building", "gebaeude", "arbeit"] },
  { emoji: "🏣", names: ["post", "japanese post office", "gebaeude", "post"] },
  { emoji: "🏤", names: ["post", "post office", "gebaeude", "post"] },
  { emoji: "🏥", names: ["krankenhaus", "hospital", "gebaeude", "gesundheit"] },
  { emoji: "🏦", names: ["bank", "bank", "gebaeude", "geld"] },
  { emoji: "🏨", names: ["hotel", "hotel", "gebaeude", "reisen"] },
  { emoji: "🏩", names: ["love hotel", "love hotel", "gebaeude"] },
  { emoji: "🏪", names: ["laden", "convenience store", "gebaeude", "einkaufen"] },
  { emoji: "🏫", names: ["schule", "school", "gebaeude", "bildung"] },
  { emoji: "🏬", names: ["kaufhaus", "department store", "gebaeude", "einkaufen"] },
  { emoji: "🏭", names: ["fabrik", "factory", "gebaeude", "arbeit"] },
  { emoji: "🏯", names: ["japanisches schloss", "japanese castle", "gebaeude", "japan"] },
  { emoji: "🏰", names: ["schloss", "castle", "gebaeude", "mittelalter"] },
  { emoji: "💒", names: ["hochzeit", "wedding", "gebaeude", "feier"] },
  { emoji: "🗼", names: ["turm", "tokyo tower", "gebaeude", "japan"] },
  { emoji: "🗽", names: ["freiheitsstatue", "statue of liberty", "gebaeude", "usa"] },
  { emoji: "⛪", names: ["kirche", "church", "gebaeude", "religion"] },
  { emoji: "🕌", names: ["moschee", "mosque", "gebaeude", "religion"] },
  { emoji: "🛕", names: ["tempel", "hindu temple", "gebaeude", "religion"] },
  { emoji: "🕍", names: ["synagoge", "synagogue", "gebaeude", "religion"] },
  { emoji: "⛩", names: ["schrein", "shinto shrine", "gebaeude", "japan"] },
  { emoji: "🕋", names: ["kaaba", "kaaba", "gebaeude", "religion"] },
  { emoji: "⛲", names: ["brunnen", "fountain", "gebaeude", "wasser"] },
  { emoji: "⛺", names: ["zelt", "tent", "camping", "natur"] },
  { emoji: "🌁", names: ["nebel", "foggy", "wetter", "stadt"] },
  { emoji: "🌃", names: ["nacht", "night with stars", "nacht", "stadt"] },
  { emoji: "🏙", names: ["stadt", "cityscape", "stadt", "gebaeude"] },
  { emoji: "🌄", names: ["sonnenaufgang", "sunrise over mountains", "natur", "morgen"] },
  { emoji: "🌅", names: ["sonnenaufgang", "sunrise", "natur", "morgen"] },
  { emoji: "🌆", names: ["stadt", "cityscape at dusk", "stadt", "abend"] },
  { emoji: "🌇", names: ["sonnenuntergang", "sunset", "natur", "abend"] },
  { emoji: "🌉", names: ["bruecke", "bridge at night", "stadt", "nacht"] },
  { emoji: "♨️", names: ["heisse quellen", "hot springs", "wasser", "entspannung"] },
  { emoji: "🎠", names: ["karussell", "carousel horse", "spiel", "vergnuegen"] },
  { emoji: "🎡", names: ["riesenrad", "ferris wheel", "spiel", "vergnuegen"] },
  { emoji: "🎢", names: ["achterbahn", "roller coaster", "spiel", "vergnuegen"] },
  { emoji: "💈", names: ["friseur", "barber pole", "friseur", "schönheit"] },
  { emoji: "🎪", names: ["zirkus", "circus tent", "spiel", "unterhaltung"] },
  
  // Symbols & Signs
  { emoji: "❤️", names: ["herz", "red heart", "liebe", "herz"] },
  { emoji: "🧡", names: ["orange herz", "orange heart", "liebe", "herz"] },
  { emoji: "💛", names: ["gelbes herz", "yellow heart", "liebe", "herz"] },
  { emoji: "💚", names: ["gruenes herz", "green heart", "liebe", "herz"] },
  { emoji: "💙", names: ["blaues herz", "blue heart", "liebe", "herz"] },
  { emoji: "💜", names: ["lila herz", "purple heart", "liebe", "herz"] },
  { emoji: "🖤", names: ["schwarzes herz", "black heart", "liebe", "herz"] },
  { emoji: "🤍", names: ["weisses herz", "white heart", "liebe", "herz"] },
  { emoji: "🤎", names: ["braunes herz", "brown heart", "liebe", "herz"] },
  { emoji: "💔", names: ["gebrochenes herz", "broken heart", "liebe", "traurig"] },
  { emoji: "❣️", names: ["herz", "heart exclamation", "liebe", "herz"] },
  { emoji: "💕", names: ["zwei herzen", "two hearts", "liebe", "herz"] },
  { emoji: "💞", names: ["drehende herzen", "revolving hearts", "liebe", "herz"] },
  { emoji: "💓", names: ["schlagendes herz", "beating heart", "liebe", "herz"] },
  { emoji: "💗", names: ["wachsendes herz", "growing heart", "liebe", "herz"] },
  { emoji: "💖", names: ["funkelndes herz", "sparkling heart", "liebe", "herz"] },
  { emoji: "💘", names: ["pfeil herz", "heart with arrow", "liebe", "herz"] },
  { emoji: "💝", names: ["geschenk herz", "heart with ribbon", "liebe", "geschenk"] },
  { emoji: "💟", names: ["herz dekoration", "heart decoration", "liebe", "herz"] },
  { emoji: "☮️", names: ["frieden", "peace symbol", "frieden", "symbol"] },
  { emoji: "✝️", names: ["kreuz", "latin cross", "religion", "christentum"] },
  { emoji: "☪️", names: ["mond stern", "star and crescent", "religion", "islam"] },
  { emoji: "🕉", names: ["om", "om", "religion", "hinduismus"] },
  { emoji: "☸️", names: ["dharma rad", "wheel of dharma", "religion", "buddhismus"] },
  { emoji: "✡️", names: ["stern david", "star of david", "religion", "judentum"] },
  { emoji: "🔯", names: ["stern", "dotted six pointed star", "religion", "symbol"] },
  { emoji: "🕎", names: ["menora", "menorah", "religion", "judentum"] },
  { emoji: "☯️", names: ["yin yang", "yin yang", "religion", "taoismus"] },
  { emoji: "☦️", names: ["orthodoxes kreuz", "orthodox cross", "religion", "christentum"] },
  { emoji: "🛐", names: ["gebetsplatz", "place of worship", "religion", "gebet"] },
  { emoji: "⛎", names: ["ophiuchus", "ophiuchus", "sternzeichen", "astrologie"] },
  { emoji: "♈", names: ["widder", "aries", "sternzeichen", "astrologie"] },
  { emoji: "♉", names: ["stier", "taurus", "sternzeichen", "astrologie"] },
  { emoji: "♊", names: ["zwillinge", "gemini", "sternzeichen", "astrologie"] },
  { emoji: "♋", names: ["krebs", "cancer", "sternzeichen", "astrologie"] },
  { emoji: "♌", names: ["loewe", "leo", "sternzeichen", "astrologie"] },
  { emoji: "♍", names: ["jungfrau", "virgo", "sternzeichen", "astrologie"] },
  { emoji: "♎", names: ["waage", "libra", "sternzeichen", "astrologie"] },
  { emoji: "♏", names: ["skorpion", "scorpius", "sternzeichen", "astrologie"] },
  { emoji: "♐", names: ["schuetze", "sagittarius", "sternzeichen", "astrologie"] },
  { emoji: "♑", names: ["steinbock", "capricorn", "sternzeichen", "astrologie"] },
  { emoji: "♒", names: ["wassermann", "aquarius", "sternzeichen", "astrologie"] },
  { emoji: "♓", names: ["fische", "pisces", "sternzeichen", "astrologie"] },
  { emoji: "🆔", names: ["id", "id button", "identifikation", "ausweis"] },
  { emoji: "⚛️", names: ["atom", "atom symbol", "wissenschaft", "physik"] },
  { emoji: "🉑", names: ["akzeptiert", "accept button", "japanisch", "ok"] },
  { emoji: "☢️", names: ["radioaktiv", "radioactive", "warnung", "gefahr"] },
  { emoji: "☣️", names: ["biohazard", "biohazard", "warnung", "gefahr"] },
  { emoji: "📴", names: ["handy aus", "mobile phone off", "telefon", "aus"] },
  { emoji: "📳", names: ["vibrieren", "vibration mode", "telefon", "modus"] },
  { emoji: "🈶", names: ["nicht kostenlos", "not free of charge button", "japanisch"] },
  { emoji: "🈚", names: ["kostenlos", "free button", "japanisch"] },
  { emoji: "🈸", names: ["bewerbung", "application button", "japanisch"] },
  { emoji: "🈺", names: ["oeffnungszeiten", "open for business button", "japanisch"] },
  { emoji: "🈷️", names: ["monatlich", "monthly amount button", "japanisch"] },
  { emoji: "✴️", names: ["achtzackiger stern", "eight pointed star", "stern", "symbol"] },
  { emoji: "🆚", names: ["gegen", "vs button", "sport", "wettkampf"] },
  { emoji: "💮", names: ["weisse blume", "white flower", "blume", "japanisch"] },
  { emoji: "🉐", names: ["schnaeppchen", "bargain button", "japanisch", "geld"] },
  { emoji: "㊙️", names: ["geheimnis", "secret button", "japanisch", "geheim"] },
  { emoji: "㊗️", names: ["glueckwunsch", "congratulations button", "japanisch", "feier"] },
  { emoji: "🈴", names: ["bestehen", "passing grade button", "japanisch"] },
  { emoji: "🈵", names: ["voll", "no vacancy button", "japanisch"] },
  { emoji: "🈹", names: ["rabatt", "discount button", "japanisch", "geld"] },
  { emoji: "🈲", names: ["verboten", "prohibited button", "japanisch", "verboten"] },
  { emoji: "🅰️", names: ["a", "a button", "blutgruppe", "buchstabe"] },
  { emoji: "🅱️", names: ["b", "b button", "blutgruppe", "buchstabe"] },
  { emoji: "🆎", names: ["ab", "ab button", "blutgruppe", "buchstabe"] },
  { emoji: "🆑", names: ["cl", "cl button", "japanisch"] },
  { emoji: "🅾️", names: ["o", "o button", "blutgruppe", "buchstabe"] },
  { emoji: "🆘", names: ["sos", "sos button", "hilfe", "notfall"] },
  { emoji: "❌", names: ["kreuz", "cross mark", "falsch", "nein"] },
  { emoji: "⭕", names: ["kreis", "heavy large circle", "richtig", "ja"] },
  { emoji: "🛑", names: ["stopp", "stop sign", "verkehr", "stopp"] },
  { emoji: "⛔", names: ["verboten", "no entry", "verkehr", "verboten"] },
  { emoji: "📛", names: ["namensschild", "name badge", "identifikation"] },
  { emoji: "🚫", names: ["verboten", "prohibited", "verboten", "nein"] },
  { emoji: "💯", names: ["hundert", "hundred points", "zahl", "perfekt"] },
  { emoji: "💢", names: ["wut", "anger symbol", "wut", "emotion"] },
  { emoji: "♨️", names: ["heisse quellen", "hot springs", "wasser", "entspannung"] },
  { emoji: "🚷", names: ["fussgaenger verboten", "no pedestrians", "verkehr", "verboten"] },
  { emoji: "🚯", names: ["muell verboten", "no littering", "umwelt", "verboten"] },
  { emoji: "🚳", names: ["fahrrad verboten", "no bicycles", "verkehr", "verboten"] },
  { emoji: "🚱", names: ["kein trinkwasser", "non potable water", "wasser", "verboten"] },
  { emoji: "🔞", names: ["ab 18", "no one under eighteen", "alter", "verboten"] },
  { emoji: "📵", names: ["handy verboten", "no mobile phones", "telefon", "verboten"] },
  { emoji: "🚭", names: ["rauchen verboten", "no smoking", "rauchen", "verboten"] },
  { emoji: "❗", names: ["ausrufezeichen", "exclamation mark", "warnung", "wichtig"] },
  { emoji: "❓", names: ["fragezeichen", "question mark", "frage", "hilfe"] },
  { emoji: "❕", names: ["weisses ausrufezeichen", "white exclamation mark", "warnung"] },
  { emoji: "❔", names: ["weisses fragezeichen", "white question mark", "frage"] },
  { emoji: "‼️", names: ["doppeltes ausrufezeichen", "double exclamation mark", "warnung"] },
  { emoji: "⁉️", names: ["ausrufe frage", "exclamation question mark", "frage"] },
  { emoji: "🔅", names: ["dimm", "dim button", "helligkeit", "niedrig"] },
  { emoji: "🔆", names: ["hell", "bright button", "helligkeit", "hoch"] },
  { emoji: "〽️", names: ["teilzeichen", "part alternation mark", "japanisch"] },
  { emoji: "⚠️", names: ["warnung", "warning", "warnung", "gefahr"] },
  { emoji: "🔱", names: ["trident", "trident emblem", "symbol", "macht"] },
  { emoji: "⚜️", names: ["fleur de lis", "fleur de lis", "symbol", "frankreich"] },
  { emoji: "🔰", names: ["anfaenger", "japanese symbol for beginner", "japanisch", "neu"] },
  { emoji: "♻️", names: ["recycling", "recycling symbol", "umwelt", "wiederverwertung"] },
  { emoji: "✅", names: ["haken", "check mark button", "richtig", "erledigt"] },
  { emoji: "🈯", names: ["reserviert", "reserved button", "japanisch"] },
  { emoji: "💹", names: ["chart", "chart increasing with yen", "geld", "wachstum"] },
  { emoji: "❇️", names: ["sparkle", "sparkle", "glitzer", "schön"] },
  { emoji: "✳️", names: ["achtzackiger stern", "eight spoked asterisk", "stern"] },
  { emoji: "❎", names: ["kreuz knopf", "cross mark button", "falsch", "nein"] },
  { emoji: "🌐", names: ["globus", "globe with meridians", "welt", "internet"] },
  { emoji: "💠", names: ["raute", "diamond with a dot", "symbol", "edelstein"] },
  { emoji: "Ⓜ️", names: ["m", "circled m", "buchstabe", "metro"] },
  { emoji: "🌀", names: ["zyklon", "cyclone", "wetter", "sturm"] },
  { emoji: "💤", names: ["schlaf", "zzz", "schlafen", "muede"] },
  { emoji: "🏧", names: ["geldautomat", "atm sign", "geld", "bank"] },
  { emoji: "🚾", names: ["wc", "water closet", "toilette", "hygiene"] },
  { emoji: "♿", names: ["rollstuhl", "wheelchair symbol", "hilfe", "behinderung"] },
  { emoji: "🅿️", names: ["parken", "p button", "verkehr", "parkplatz"] },
  { emoji: "🈳", names: ["leer", "vacant button", "japanisch"] },
  { emoji: "🈂️", names: ["service", "service charge button", "japanisch"] },
  { emoji: "🛂", names: ["passkontrolle", "passport control", "reisen", "kontrolle"] },
  { emoji: "🛃", names: ["zoll", "customs", "reisen", "kontrolle"] },
  { emoji: "🛄", names: ["gepaeck", "baggage claim", "reisen", "flughafen"] },
  { emoji: "🛅", names: ["gepaeckaufbewahrung", "left luggage", "reisen", "flughafen"] },
  { emoji: "🛆", names: ["kontrolle", "control knobs", "technik"] },
  { emoji: "🛇", names: ["kontrolle", "control knobs", "technik"] },
  { emoji: "🛈", names: ["kontrolle", "control knobs", "technik"] },
  { emoji: "🛉", names: ["kontrolle", "control knobs", "technik"] },
  { emoji: "🛊", names: ["kontrolle", "control knobs", "technik"] },
  { emoji: "🛋", names: ["sofa", "couch and lamp", "wohnen", "möbel"] },
  { emoji: "🛌", names: ["bett", "person in bed", "schlafen", "ruhe"] },
  { emoji: "🛍", names: ["einkaufstaschen", "shopping bags", "einkaufen", "taschen"] },
  { emoji: "🛎", names: ["klingel", "bellhop bell", "hotel", "service"] },
  { emoji: "🛏", names: ["bett", "bed", "schlafen", "möbel"] },
  { emoji: "🛐", names: ["gebetsplatz", "place of worship", "religion", "gebet"] },
  { emoji: "🛑", names: ["stoppschild", "stop sign", "verkehr", "stopp"] },
  { emoji: "🛒", names: ["einkaufswagen", "shopping cart", "einkaufen", "laden"] },
  { emoji: "🛓", names: ["motorroller", "motor scooter", "fahrzeug", "transport"] },
  { emoji: "🛔", names: ["motorroller", "motor scooter", "fahrzeug", "transport"] },
  { emoji: "🛕", names: ["tempel", "hindu temple", "gebaeude", "religion"] },
  { emoji: "🛖", names: ["huette", "hut", "gebaeude", "wohnen"] },
  { emoji: "🛗", names: ["aufzug", "elevator", "gebaeude", "transport"] },
  { emoji: "🛘", names: ["aufzug", "elevator", "gebaeude", "transport"] },
  { emoji: "🛙", names: ["aufzug", "elevator", "gebaeude", "transport"] },
  { emoji: "🛚", names: ["aufzug", "elevator", "gebaeude", "transport"] },
  { emoji: "🛛", names: ["aufzug", "elevator", "gebaeude", "transport"] },
  { emoji: "🛜", names: ["wlan", "wireless", "technik", "internet"] },
  { emoji: "🛝", names: ["rutsche", "playground slide", "spiel", "kinder"] },
  { emoji: "🛞", names: ["reifen", "wheel", "fahrzeug", "auto"] },
  { emoji: "🛟", names: ["rettungsring", "ring buoy", "rettung", "wasser"] },
  { emoji: "🛠", names: ["werkzeug", "hammer and wrench", "werkzeug", "reparieren"] },
  { emoji: "🛡", names: ["schild", "shield", "schutz", "kampf"] },
  { emoji: "🛢", names: ["oel", "oil drum", "energie", "industrie"] },
  { emoji: "🛣", names: ["strasse", "motorway", "verkehr", "strasse"] },
  { emoji: "🛤", names: ["eisenbahn", "railway track", "verkehr", "zug"] },
  { emoji: "🛥", names: ["motorboot", "motor boat", "schiff", "meer"] },
  { emoji: "🛦", names: ["motorboot", "motor boat", "schiff", "meer"] },
  { emoji: "🛧", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛨", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛩", names: ["kleines flugzeug", "small airplane", "flugzeug"] },
  { emoji: "🛪", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛫", names: ["abflug", "airplane departure", "flugzeug", "reisen"] },
  { emoji: "🛬", names: ["ankunft", "airplane arrival", "flugzeug", "reisen"] },
  { emoji: "🛭", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛮", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛯", names: ["flugzeug", "airplane", "flugzeug", "reisen"] },
  { emoji: "🛰", names: ["satellit", "satellite", "weltraum", "technik"] },
  { emoji: "🛱", names: ["satellit", "satellite", "weltraum", "technik"] },
  { emoji: "🛲", names: ["satellit", "satellite", "weltraum", "technik"] },
  { emoji: "🛳", names: ["passagierschiff", "passenger ship", "schiff", "reisen"] },
  { emoji: "🛴", names: ["tretroller", "kick scooter", "fahrzeug", "transport"] },
  { emoji: "🛵", names: ["roller", "motor scooter", "fahrzeug", "transport"] },
  { emoji: "🛶", names: ["kanu", "canoe", "schiff", "sport"] },
  { emoji: "🛷", names: ["schlitten", "sled", "sport", "winter"] },
  { emoji: "🛸", names: ["ufo", "flying saucer", "weltraum", "fantasie"] },
  { emoji: "🛹", names: ["skateboard", "skateboard", "fahrzeug", "sport"] },
  { emoji: "🛺", names: ["auto rickshaw", "auto rickshaw", "fahrzeug", "transport"] },
  { emoji: "🛻", names: ["pickup", "pickup truck", "fahrzeug", "transport"] },
  { emoji: "🛼", names: ["roller", "roller skate", "fahrzeug", "sport"] },
  { emoji: "🛽", names: ["tankstelle", "fuel pump", "auto", "tanken"] },
  { emoji: "🛾", names: ["tankstelle", "fuel pump", "auto", "tanken"] },
  { emoji: "🛿", names: ["tankstelle", "fuel pump", "auto", "tanken"] },
  
  // Hand Gestures & Body Parts
  { emoji: "👋", names: ["winken", "waving hand", "gruess", "hand"] },
  { emoji: "🤚", names: ["hand", "raised back of hand", "hand", "stopp"] },
  { emoji: "🖐", names: ["hand", "hand with fingers splayed", "hand", "fuenf"] },
  { emoji: "✋", names: ["hand", "raised hand", "hand", "stopp"] },
  { emoji: "🖖", names: ["vulcan", "vulcan salute", "hand", "star trek"] },
  { emoji: "👌", names: ["ok", "ok hand", "hand", "gut"] },
  { emoji: "🤌", names: ["pinched fingers", "pinched fingers", "hand", "italien"] },
  { emoji: "🤏", names: ["kneifen", "pinching hand", "hand", "klein"] },
  { emoji: "✌️", names: ["victory", "victory hand", "hand", "sieg"] },
  { emoji: "🤞", names: ["finger gekreuzt", "crossed fingers", "hand", "glueck"] },
  { emoji: "🤟", names: ["love you", "love you gesture", "hand", "liebe"] },
  { emoji: "🤘", names: ["horns", "sign of the horns", "hand", "rock"] },
  { emoji: "🤙", names: ["call me", "call me hand", "hand", "telefon"] },
  { emoji: "👈", names: ["links", "backhand index pointing left", "hand", "richtung"] },
  { emoji: "👉", names: ["rechts", "backhand index pointing right", "hand", "richtung"] },
  { emoji: "👆", names: ["oben", "backhand index pointing up", "hand", "richtung"] },
  { emoji: "🖕", names: ["mittelfinger", "middle finger", "hand", "beleidigung"] },
  { emoji: "👇", names: ["unten", "backhand index pointing down", "hand", "richtung"] },
  { emoji: "☝️", names: ["zeigen", "index pointing up", "hand", "richtung"] },
  { emoji: "👍", names: ["daumen hoch", "thumbs up", "hand", "gut"] },
  { emoji: "👎", names: ["daumen runter", "thumbs down", "hand", "schlecht"] },
  { emoji: "✊", names: ["faust", "raised fist", "hand", "kraft"] },
  { emoji: "👊", names: ["faust", "oncoming fist", "hand", "kampf"] },
  { emoji: "🤛", names: ["faust links", "left facing fist", "hand", "kampf"] },
  { emoji: "🤜", names: ["faust rechts", "right facing fist", "hand", "kampf"] },
  { emoji: "👏", names: ["klatschen", "clapping hands", "hand", "applaus"] },
  { emoji: "🙌", names: ["hände hoch", "raising hands", "hand", "feiern"] },
  { emoji: "👐", names: ["hände offen", "open hands", "hand", "offen"] },
  { emoji: "🤲", names: ["hände zusammen", "palms up together", "hand", "bitten"] },
  { emoji: "🤝", names: ["haendeschlag", "handshake", "hand", "gruess"] },
  { emoji: "🙏", names: ["beten", "folded hands", "hand", "gebet"] },
  { emoji: "✍️", names: ["schreiben", "writing hand", "hand", "schreiben"] },
  { emoji: "💪", names: ["muskel", "flexed biceps", "koerper", "kraft"] },
  { emoji: "🦾", names: ["mechanischer arm", "mechanical arm", "koerper", "technik"] },
  { emoji: "🦿", names: ["mechanisches bein", "mechanical leg", "koerper", "technik"] },
  { emoji: "🦵", names: ["bein", "leg", "koerper", "laufen"] },
  { emoji: "🦶", names: ["fuss", "foot", "koerper", "laufen"] },
  { emoji: "👂", names: ["ohr", "ear", "koerper", "hoeren"] },
  { emoji: "🦻", names: ["ohr hoergeraet", "ear with hearing aid", "koerper", "hilfe"] },
  { emoji: "👃", names: ["nase", "nose", "koerper", "riechen"] },
  { emoji: "🧠", names: ["gehirn", "brain", "koerper", "denken"] },
  { emoji: "🫀", names: ["herz", "anatomical heart", "koerper", "gesundheit"] },
  { emoji: "🫁", names: ["lunge", "lungs", "koerper", "gesundheit"] },
  { emoji: "🦷", names: ["zahn", "tooth", "koerper", "gesundheit"] },
  { emoji: "🦴", names: ["knochen", "bone", "koerper", "skelett"] },
  { emoji: "👀", names: ["augen", "eyes", "koerper", "sehen"] },
  { emoji: "👁", names: ["auge", "eye", "koerper", "sehen"] },
  { emoji: "👅", names: ["zunge", "tongue", "koerper", "geschmack"] },
  { emoji: "👄", names: ["mund", "mouth", "koerper", "sprechen"] },
  
  // People & Person
  { emoji: "👶", names: ["baby", "baby", "person", "kind"] },
  { emoji: "🧒", names: ["kind", "child", "person", "kind"] },
  { emoji: "👦", names: ["junge", "boy", "person", "kind"] },
  { emoji: "👧", names: ["maedchen", "girl", "person", "kind"] },
  { emoji: "🧑", names: ["person", "person", "person", "erwachsen"] },
  { emoji: "👱", names: ["person blond", "person blond hair", "person"] },
  { emoji: "👨", names: ["mann", "man", "person", "erwachsen"] },
  { emoji: "🧔", names: ["bart", "person beard", "person", "bart"] },
  { emoji: "👩", names: ["frau", "woman", "person", "erwachsen"] },
  { emoji: "🧓", names: ["aeltere person", "older person", "person", "alt"] },
  { emoji: "👴", names: ["alter mann", "old man", "person", "alt"] },
  { emoji: "👵", names: ["alte frau", "old woman", "person", "alt"] },
  { emoji: "🙍", names: ["person böse", "person frowning", "person", "traurig"] },
  { emoji: "🙎", names: ["person pouting", "person pouting", "person", "wuetend"] },
  { emoji: "🙅", names: ["person nein", "person gesturing no", "person", "nein"] },
  { emoji: "🙆", names: ["person ok", "person gesturing ok", "person", "ok"] },
  { emoji: "💁", names: ["person information", "person tipping hand", "person", "info"] },
  { emoji: "🙋", names: ["person hand hoch", "person raising hand", "person", "frage"] },
  { emoji: "🧏", names: ["person taub", "deaf person", "person", "behinderung"] },
  { emoji: "🤦", names: ["facepalm", "person facepalming", "person", "frustriert"] },
  { emoji: "🤷", names: ["schulterzucken", "person shrugging", "person", "unsicher"] },
  { emoji: "🧑‍⚕️", names: ["gesundheitsarbeiter", "health worker", "person", "beruf"] },
  { emoji: "👨‍⚕️", names: ["arzt", "man health worker", "person", "beruf"] },
  { emoji: "👩‍⚕️", names: ["aerztin", "woman health worker", "person", "beruf"] },
  { emoji: "🧑‍🎓", names: ["student", "student", "person", "bildung"] },
  { emoji: "👨‍🎓", names: ["student", "man student", "person", "bildung"] },
  { emoji: "👩‍🎓", names: ["studentin", "woman student", "person", "bildung"] },
  { emoji: "🧑‍🏫", names: ["lehrer", "teacher", "person", "beruf"] },
  { emoji: "👨‍🏫", names: ["lehrer", "man teacher", "person", "beruf"] },
  { emoji: "👩‍🏫", names: ["lehrerin", "woman teacher", "person", "beruf"] },
  { emoji: "🧑‍⚖️", names: ["richter", "judge", "person", "beruf"] },
  { emoji: "👨‍⚖️", names: ["richter", "man judge", "person", "beruf"] },
  { emoji: "👩‍⚖️", names: ["richterin", "woman judge", "person", "beruf"] },
  { emoji: "🧑‍🌾", names: ["bauer", "farmer", "person", "beruf"] },
  { emoji: "👨‍🌾", names: ["bauer", "man farmer", "person", "beruf"] },
  { emoji: "👩‍🌾", names: ["baeuerin", "woman farmer", "person", "beruf"] },
  { emoji: "🧑‍🍳", names: ["koch", "cook", "person", "beruf"] },
  { emoji: "👨‍🍳", names: ["koch", "man cook", "person", "beruf"] },
  { emoji: "👩‍🍳", names: ["koechin", "woman cook", "person", "beruf"] },
  { emoji: "🧑‍🔧", names: ["mechaniker", "mechanic", "person", "beruf"] },
  { emoji: "👨‍🔧", names: ["mechaniker", "man mechanic", "person", "beruf"] },
  { emoji: "👩‍🔧", names: ["mechanikerin", "woman mechanic", "person", "beruf"] },
  { emoji: "🧑‍🏭", names: ["arbeiter", "factory worker", "person", "beruf"] },
  { emoji: "👨‍🏭", names: ["arbeiter", "man factory worker", "person", "beruf"] },
  { emoji: "👩‍🏭", names: ["arbeiterin", "woman factory worker", "person", "beruf"] },
  { emoji: "🧑‍💼", names: ["bueroarbeiter", "office worker", "person", "beruf"] },
  { emoji: "👨‍💼", names: ["bueroarbeiter", "man office worker", "person", "beruf"] },
  { emoji: "👩‍💼", names: ["bueroarbeiterin", "woman office worker", "person", "beruf"] },
  { emoji: "🧑‍🔬", names: ["wissenschaftler", "scientist", "person", "beruf"] },
  { emoji: "👨‍🔬", names: ["wissenschaftler", "man scientist", "person", "beruf"] },
  { emoji: "👩‍🔬", names: ["wissenschaftlerin", "woman scientist", "person", "beruf"] },
  { emoji: "🧑‍💻", names: ["techniker", "technologist", "person", "beruf"] },
  { emoji: "👨‍💻", names: ["techniker", "man technologist", "person", "beruf"] },
  { emoji: "👩‍💻", names: ["technikerin", "woman technologist", "person", "beruf"] },
  { emoji: "🧑‍🎤", names: ["saenger", "singer", "person", "beruf"] },
  { emoji: "👨‍🎤", names: ["saenger", "man singer", "person", "beruf"] },
  { emoji: "👩‍🎤", names: ["saengerin", "woman singer", "person", "beruf"] },
  { emoji: "🧑‍🎨", names: ["kuenstler", "artist", "person", "beruf"] },
  { emoji: "👨‍🎨", names: ["kuenstler", "man artist", "person", "beruf"] },
  { emoji: "👩‍🎨", names: ["kuenstlerin", "woman artist", "person", "beruf"] },
  { emoji: "🧑‍✈️", names: ["pilot", "pilot", "person", "beruf"] },
  { emoji: "👨‍✈️", names: ["pilot", "man pilot", "person", "beruf"] },
  { emoji: "👩‍✈️", names: ["pilotin", "woman pilot", "person", "beruf"] },
  { emoji: "🧑‍🚀", names: ["astronaut", "astronaut", "person", "beruf"] },
  { emoji: "👨‍🚀", names: ["astronaut", "man astronaut", "person", "beruf"] },
  { emoji: "👩‍🚀", names: ["astronautin", "woman astronaut", "person", "beruf"] },
  { emoji: "🧑‍🚒", names: ["feuerwehrmann", "firefighter", "person", "beruf"] },
  { emoji: "👨‍🚒", names: ["feuerwehrmann", "man firefighter", "person", "beruf"] },
  { emoji: "👩‍🚒", names: ["feuerwehrfrau", "woman firefighter", "person", "beruf"] },
  { emoji: "👮", names: ["polizist", "police officer", "person", "beruf"] },
  { emoji: "👮‍♂️", names: ["polizist", "man police officer", "person", "beruf"] },
  { emoji: "👮‍♀️", names: ["polizistin", "woman police officer", "person", "beruf"] },
  { emoji: "🕵", names: ["detektiv", "detective", "person", "beruf"] },
  { emoji: "🕵️‍♂️", names: ["detektiv", "man detective", "person", "beruf"] },
  { emoji: "🕵️‍♀️", names: ["detektivin", "woman detective", "person", "beruf"] },
  { emoji: "💂", names: ["wache", "guard", "person", "beruf"] },
  { emoji: "💂‍♂️", names: ["wache", "man guard", "person", "beruf"] },
  { emoji: "💂‍♀️", names: ["wache", "woman guard", "person", "beruf"] },
  { emoji: "🥷", names: ["ninja", "ninja", "person", "kampf"] },
  { emoji: "👷", names: ["bauarbeiter", "construction worker", "person", "beruf"] },
  { emoji: "👷‍♂️", names: ["bauarbeiter", "man construction worker", "person", "beruf"] },
  { emoji: "👷‍♀️", names: ["bauarbeiterin", "woman construction worker", "person", "beruf"] },
  { emoji: "🤴", names: ["prinz", "prince", "person", "koenig"] },
  { emoji: "👸", names: ["prinzessin", "princess", "person", "koenig"] },
  { emoji: "👳", names: ["person turban", "person wearing turban", "person"] },
  { emoji: "👳‍♂️", names: ["mann turban", "man wearing turban", "person"] },
  { emoji: "👳‍♀️", names: ["frau turban", "woman wearing turban", "person"] },
  { emoji: "👲", names: ["person kappe", "person with skullcap", "person"] },
  { emoji: "🧕", names: ["frau kopftuch", "woman with headscarf", "person"] },
  { emoji: "🤵", names: ["person smoking", "person in tuxedo", "person", "formal"] },
  { emoji: "🤵‍♂️", names: ["mann smoking", "man in tuxedo", "person", "formal"] },
  { emoji: "🤵‍♀️", names: ["frau smoking", "woman in tuxedo", "person", "formal"] },
  { emoji: "👰", names: ["braut", "person with veil", "person", "hochzeit"] },
  { emoji: "👰‍♂️", names: ["braeutigam", "man with veil", "person", "hochzeit"] },
  { emoji: "👰‍♀️", names: ["braut", "woman with veil", "person", "hochzeit"] },
  { emoji: "🤰", names: ["schwanger", "pregnant woman", "person", "schwangerschaft"] },
  { emoji: "🤱", names: ["stillen", "breast feeding", "person", "baby"] },
  { emoji: "👼", names: ["baby engel", "baby angel", "person", "engel"] },
  { emoji: "🎅", names: ["weihnachtsmann", "santa claus", "person", "weihnachten"] },
  { emoji: "🤶", names: ["weihnachtsfrau", "mrs claus", "person", "weihnachten"] },
  { emoji: "🦸", names: ["superheld", "superhero", "person", "fantasie"] },
  { emoji: "🦸‍♂️", names: ["superheld", "man superhero", "person", "fantasie"] },
  { emoji: "🦸‍♀️", names: ["superheldin", "woman superhero", "person", "fantasie"] },
  { emoji: "🦹", names: ["superschurke", "supervillain", "person", "fantasie"] },
  { emoji: "🦹‍♂️", names: ["superschurke", "man supervillain", "person", "fantasie"] },
  { emoji: "🦹‍♀️", names: ["superschurkin", "woman supervillain", "person", "fantasie"] },
  { emoji: "🧙", names: ["magier", "mage", "person", "fantasie"] },
  { emoji: "🧙‍♂️", names: ["magier", "man mage", "person", "fantasie"] },
  { emoji: "🧙‍♀️", names: ["magierin", "woman mage", "person", "fantasie"] },
  { emoji: "🧚", names: ["fee", "fairy", "person", "fantasie"] },
  { emoji: "🧚‍♂️", names: ["fee", "man fairy", "person", "fantasie"] },
  { emoji: "🧚‍♀️", names: ["fee", "woman fairy", "person", "fantasie"] },
  { emoji: "🧛", names: ["vampir", "vampire", "person", "fantasie"] },
  { emoji: "🧛‍♂️", names: ["vampir", "man vampire", "person", "fantasie"] },
  { emoji: "🧛‍♀️", names: ["vampirin", "woman vampire", "person", "fantasie"] },
  { emoji: "🧜", names: ["meerjungfrau", "merperson", "person", "fantasie"] },
  { emoji: "🧜‍♂️", names: ["meermann", "merman", "person", "fantasie"] },
  { emoji: "🧜‍♀️", names: ["meerjungfrau", "mermaid", "person", "fantasie"] },
  { emoji: "🧝", names: ["elf", "elf", "person", "fantasie"] },
  { emoji: "🧝‍♂️", names: ["elf", "man elf", "person", "fantasie"] },
  { emoji: "🧝‍♀️", names: ["elfin", "woman elf", "person", "fantasie"] },
  { emoji: "🧞", names: ["dschinn", "genie", "person", "fantasie"] },
  { emoji: "🧞‍♂️", names: ["dschinn", "man genie", "person", "fantasie"] },
  { emoji: "🧞‍♀️", names: ["dschinn", "woman genie", "person", "fantasie"] },
  { emoji: "🧟", names: ["zombie", "zombie", "person", "fantasie"] },
  { emoji: "🧟‍♂️", names: ["zombie", "man zombie", "person", "fantasie"] },
  { emoji: "🧟‍♀️", names: ["zombie", "woman zombie", "person", "fantasie"] },
  { emoji: "💆", names: ["massage", "person getting massage", "person", "wellness"] },
  { emoji: "💆‍♂️", names: ["massage", "man getting massage", "person", "wellness"] },
  { emoji: "💆‍♀️", names: ["massage", "woman getting massage", "person", "wellness"] },
  { emoji: "💇", names: ["friseur", "person getting haircut", "person", "schönheit"] },
  { emoji: "💇‍♂️", names: ["friseur", "man getting haircut", "person", "schönheit"] },
  { emoji: "💇‍♀️", names: ["friseur", "woman getting haircut", "person", "schönheit"] },
  { emoji: "🚶", names: ["gehen", "person walking", "person", "bewegung"] },
  { emoji: "🚶‍♂️", names: ["gehen", "man walking", "person", "bewegung"] },
  { emoji: "🚶‍♀️", names: ["gehen", "woman walking", "person", "bewegung"] },
  { emoji: "🧍", names: ["stehen", "person standing", "person", "stehen"] },
  { emoji: "🧍‍♂️", names: ["stehen", "man standing", "person", "stehen"] },
  { emoji: "🧍‍♀️", names: ["stehen", "woman standing", "person", "stehen"] },
  { emoji: "🧎", names: ["knien", "person kneeling", "person", "knien"] },
  { emoji: "🧎‍♂️", names: ["knien", "man kneeling", "person", "knien"] },
  { emoji: "🧎‍♀️", names: ["knien", "woman kneeling", "person", "knien"] },
  { emoji: "🏃", names: ["laufen", "person running", "person", "sport"] },
  { emoji: "🏃‍♂️", names: ["laufen", "man running", "person", "sport"] },
  { emoji: "🏃‍♀️", names: ["laufen", "woman running", "person", "sport"] },
  { emoji: "💃", names: ["tanzen", "woman dancing", "person", "tanzen"] },
  { emoji: "🕺", names: ["tanzen", "man dancing", "person", "tanzen"] },
  { emoji: "🕴", names: ["person anzug", "person in suit levitating", "person", "schweben"] },
  { emoji: "👯", names: ["personen kaninchen", "people with bunny ears", "person", "spass"] },
  { emoji: "👯‍♂️", names: ["maenner kaninchen", "men with bunny ears", "person", "spass"] },
  { emoji: "👯‍♀️", names: ["frauen kaninchen", "women with bunny ears", "person", "spass"] },
  { emoji: "🧖", names: ["sauna", "person in steamy room", "person", "wellness"] },
  { emoji: "🧖‍♂️", names: ["sauna", "man in steamy room", "person", "wellness"] },
  { emoji: "🧖‍♀️", names: ["sauna", "woman in steamy room", "person", "wellness"] },
  { emoji: "🧗", names: ["klettern", "person climbing", "person", "sport"] },
  { emoji: "🧗‍♂️", names: ["klettern", "man climbing", "person", "sport"] },
  { emoji: "🧗‍♀️", names: ["klettern", "woman climbing", "person", "sport"] },
  { emoji: "🤺", names: ["fechten", "person fencing", "person", "sport"] },
  { emoji: "🏇", names: ["reiten", "horse racing", "person", "sport"] },
  { emoji: "⛷", names: ["ski", "skier", "person", "sport"] },
  { emoji: "🏂", names: ["snowboard", "snowboarder", "person", "sport"] },
  { emoji: "🏌", names: ["golf", "person golfing", "person", "sport"] },
  { emoji: "🏌️‍♂️", names: ["golf", "man golfing", "person", "sport"] },
  { emoji: "🏌️‍♀️", names: ["golf", "woman golfing", "person", "sport"] },
  { emoji: "🏄", names: ["surfen", "person surfing", "person", "sport"] },
  { emoji: "🏄‍♂️", names: ["surfen", "man surfing", "person", "sport"] },
  { emoji: "🏄‍♀️", names: ["surfen", "woman surfing", "person", "sport"] },
  { emoji: "🚣", names: ["rudern", "person rowing boat", "person", "sport"] },
  { emoji: "🚣‍♂️", names: ["rudern", "man rowing boat", "person", "sport"] },
  { emoji: "🚣‍♀️", names: ["rudern", "woman rowing boat", "person", "sport"] },
  { emoji: "🏊", names: ["schwimmen", "person swimming", "person", "sport"] },
  { emoji: "🏊‍♂️", names: ["schwimmen", "man swimming", "person", "sport"] },
  { emoji: "🏊‍♀️", names: ["schwimmen", "woman swimming", "person", "sport"] },
  { emoji: "⛹", names: ["basketball", "person bouncing ball", "person", "sport"] },
  { emoji: "⛹️‍♂️", names: ["basketball", "man bouncing ball", "person", "sport"] },
  { emoji: "⛹️‍♀️", names: ["basketball", "woman bouncing ball", "person", "sport"] },
  { emoji: "🏋", names: ["gewichte", "person lifting weights", "person", "sport"] },
  { emoji: "🏋️‍♂️", names: ["gewichte", "man lifting weights", "person", "sport"] },
  { emoji: "🏋️‍♀️", names: ["gewichte", "woman lifting weights", "person", "sport"] },
  { emoji: "🚴", names: ["fahrrad", "person biking", "person", "sport"] },
  { emoji: "🚴‍♂️", names: ["fahrrad", "man biking", "person", "sport"] },
  { emoji: "🚴‍♀️", names: ["fahrrad", "woman biking", "person", "sport"] },
  { emoji: "🚵", names: ["mountainbike", "person mountain biking", "person", "sport"] },
  { emoji: "🚵‍♂️", names: ["mountainbike", "man mountain biking", "person", "sport"] },
  { emoji: "🚵‍♀️", names: ["mountainbike", "woman mountain biking", "person", "sport"] },
  { emoji: "🤸", names: ["radschlagen", "person cartwheeling", "person", "sport"] },
  { emoji: "🤸‍♂️", names: ["radschlagen", "man cartwheeling", "person", "sport"] },
  { emoji: "🤸‍♀️", names: ["radschlagen", "woman cartwheeling", "person", "sport"] },
  { emoji: "🤼", names: ["ringen", "people wrestling", "person", "sport"] },
  { emoji: "🤼‍♂️", names: ["ringen", "men wrestling", "person", "sport"] },
  { emoji: "🤼‍♀️", names: ["ringen", "women wrestling", "person", "sport"] },
  { emoji: "🤽", names: ["wasserball", "person playing water polo", "person", "sport"] },
  { emoji: "🤽‍♂️", names: ["wasserball", "man playing water polo", "person", "sport"] },
  { emoji: "🤽‍♀️", names: ["wasserball", "woman playing water polo", "person", "sport"] },
  { emoji: "🤾", names: ["handball", "person playing handball", "person", "sport"] },
  { emoji: "🤾‍♂️", names: ["handball", "man playing handball", "person", "sport"] },
  { emoji: "🤾‍♀️", names: ["handball", "woman playing handball", "person", "sport"] },
  { emoji: "🤹", names: ["jonglieren", "person juggling", "person", "spass"] },
  { emoji: "🤹‍♂️", names: ["jonglieren", "man juggling", "person", "spass"] },
  { emoji: "🤹‍♀️", names: ["jonglieren", "woman juggling", "person", "spass"] },
  { emoji: "🧘", names: ["meditation", "person in lotus position", "person", "entspannung"] },
  { emoji: "🧘‍♂️", names: ["meditation", "man in lotus position", "person", "entspannung"] },
  { emoji: "🧘‍♀️", names: ["meditation", "woman in lotus position", "person", "entspannung"] },
  { emoji: "🛀", names: ["bad", "person taking bath", "person", "hygiene"] },
  { emoji: "🛌", names: ["bett", "person in bed", "person", "schlafen"] },
  { emoji: "👭", names: ["frauen hand", "women holding hands", "person", "freundschaft"] },
  { emoji: "👫", names: ["frau mann hand", "woman and man holding hands", "person", "liebe"] },
  { emoji: "👬", names: ["maenner hand", "men holding hands", "person", "freundschaft"] },
  { emoji: "💏", names: ["kuss", "kiss", "person", "liebe"] },
  { emoji: "💑", names: ["paar herz", "couple with heart", "person", "liebe"] },
  { emoji: "👪", names: ["familie", "family", "person", "familie"] },
  { emoji: "👨‍👩‍👧", names: ["familie", "family man woman girl", "person", "familie"] },
  { emoji: "👨‍👩‍👦", names: ["familie", "family man woman boy", "person", "familie"] },
  { emoji: "👨‍👩‍👧‍👦", names: ["familie", "family man woman girl boy", "person", "familie"] },
  { emoji: "👨‍👨‍👧", names: ["familie", "family man man girl", "person", "familie"] },
  { emoji: "👨‍👨‍👦", names: ["familie", "family man man boy", "person", "familie"] },
  { emoji: "👨‍👨‍👧‍👦", names: ["familie", "family man man girl boy", "person", "familie"] },
  { emoji: "👩‍👩‍👧", names: ["familie", "family woman woman girl", "person", "familie"] },
  { emoji: "👩‍👩‍👦", names: ["familie", "family woman woman boy", "person", "familie"] },
  { emoji: "👩‍👩‍👧‍👦", names: ["familie", "family woman woman girl boy", "person", "familie"] },
  { emoji: "👨‍👦", names: ["familie", "family man boy", "person", "familie"] },
  { emoji: "👨‍👦‍👦", names: ["familie", "family man boy boy", "person", "familie"] },
  { emoji: "👨‍👧", names: ["familie", "family man girl", "person", "familie"] },
  { emoji: "👨‍👧‍👦", names: ["familie", "family man girl boy", "person", "familie"] },
  { emoji: "👨‍👧‍👧", names: ["familie", "family man girl girl", "person", "familie"] },
  { emoji: "👩‍👦", names: ["familie", "family woman boy", "person", "familie"] },
  { emoji: "👩‍👦‍👦", names: ["familie", "family woman boy boy", "person", "familie"] },
  { emoji: "👩‍👧", names: ["familie", "family woman girl", "person", "familie"] },
  { emoji: "👩‍👧‍👦", names: ["familie", "family woman girl boy", "person", "familie"] },
  { emoji: "👩‍👧‍👧", names: ["familie", "family woman girl girl", "person", "familie"] },
  { emoji: "🗣", names: ["sprechen", "speaking head", "person", "sprechen"] },
  { emoji: "👤", names: ["person siluette", "bust in silhouette", "person"] },
  { emoji: "👥", names: ["personen siluette", "busts in silhouette", "person", "gruppe"] },
  { emoji: "🤳", names: ["selfie", "selfie", "person", "foto"] },
  { emoji: "💪", names: ["muskel", "flexed biceps", "person", "kraft"] },
  { emoji: "🦵", names: ["bein", "leg", "person", "laufen"] },
  { emoji: "🦶", names: ["fuss", "foot", "person", "laufen"] },
  { emoji: "👂", names: ["ohr", "ear", "person", "hoeren"] },
  { emoji: "🦻", names: ["ohr hoergeraet", "ear with hearing aid", "person", "hilfe"] },
  { emoji: "👃", names: ["nase", "nose", "person", "riechen"] },
  { emoji: "🧠", names: ["gehirn", "brain", "person", "denken"] },
  { emoji: "🫀", names: ["herz", "anatomical heart", "person", "gesundheit"] },
  { emoji: "🫁", names: ["lunge", "lungs", "person", "gesundheit"] },
  { emoji: "🦷", names: ["zahn", "tooth", "person", "gesundheit"] },
  { emoji: "🦴", names: ["knochen", "bone", "person", "skelett"] },
  { emoji: "👀", names: ["augen", "eyes", "person", "sehen"] },
  { emoji: "👁", names: ["auge", "eye", "person", "sehen"] },
  { emoji: "👅", names: ["zunge", "tongue", "person", "geschmack"] },
  { emoji: "👄", names: ["mund", "mouth", "person", "sprechen"] },
  { emoji: "👶", names: ["baby", "baby", "person", "kind"] },
  { emoji: "🧒", names: ["kind", "child", "person", "kind"] },
  { emoji: "👦", names: ["junge", "boy", "person", "kind"] },
  { emoji: "👧", names: ["maedchen", "girl", "person", "kind"] },
  { emoji: "🧑", names: ["person", "person", "person", "erwachsen"] },
  { emoji: "👱", names: ["person blond", "person blond hair", "person"] },
  { emoji: "👨", names: ["mann", "man", "person", "erwachsen"] },
  { emoji: "🧔", names: ["bart", "person beard", "person", "bart"] },
  { emoji: "👩", names: ["frau", "woman", "person", "erwachsen"] },
  { emoji: "🧓", names: ["aeltere person", "older person", "person", "alt"] },
  { emoji: "👴", names: ["alter mann", "old man", "person", "alt"] },
  { emoji: "👵", names: ["alte frau", "old woman", "person", "alt"] },
];

// Gruppiere Emojis nach Kategorien für die Anzeige
const getEmojiCategory = (emojiData: EmojiData): string => {
  const names = emojiData.names.map(n => n.toLowerCase());
  
  if (names.some(n => ["lachen", "smile", "traurig", "sad", "wuetend", "angry", "ueberrascht", "surprised", "weinen", "cry", "kuss", "kiss", "liebe", "love"].includes(n))) {
    return "Smileys";
  }
  if (names.some(n => ["essen", "food", "getraenk", "drink", "obst", "fruit", "gemuese", "vegetable", "kaffee", "coffee", "bier", "beer", "wein", "wine"].includes(n))) {
    return "Food & Drink";
  }
  if (names.some(n => ["sport", "spiel", "game", "musik", "music", "kunst", "art", "fussball", "soccer", "basketball", "tennis"].includes(n))) {
    return "Activities";
  }
  if (names.some(n => ["computer", "phone", "buch", "book", "werkzeug", "tool", "medizin", "medicine", "uhr", "watch", "kamera", "camera"].includes(n))) {
    return "Objects";
  }
  if (names.some(n => ["tier", "animal", "pflanze", "plant", "blume", "flower", "wetter", "weather", "hund", "dog", "katze", "cat", "baum", "tree"].includes(n))) {
    return "Nature";
  }
  return "Other";
};

// Erstelle Kategorien dynamisch
const EMOJI_CATEGORIES: Record<string, EmojiData[]> = {
  "Popular": EMOJI_DATABASE.slice(0, 20),
  "Smileys": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Smileys"),
  "Food & Drink": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Food & Drink"),
  "Activities": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Activities"),
  "Objects": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Objects"),
  "Nature": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Nature"),
  "Other": EMOJI_DATABASE.filter(e => getEmojiCategory(e) === "Other"),
};

const NewActivityModal: React.FC<NewActivityModalProps> = ({ activity, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(activity?.title || '');
  const [emoji, setEmoji] = useState(activity?.emoji || '✨');
  const [type, setType] = useState<ActivityType>(activity?.type || 'binär');
  const [description, setDescription] = useState(activity?.description || '');
  const [unit, setUnit] = useState(activity?.unit || '');
  const [isNumberData, setIsNumberData] = useState(activity?.isNumberData ?? true);
  const [isMultiSelect, setIsMultiSelect] = useState(activity?.isMultiSelect ?? false);
  const [customDays, setCustomDays] = useState<number[]>(activity?.customDays || [0, 1, 2, 3, 4, 5, 6]);
  const [options, setOptions] = useState<SelectionOption[]>(activity?.options || []);
  const [protocolItems, setProtocolItems] = useState<ProtocolItem[]>(activity?.protocolItems || []);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newProtocolLabel, setNewProtocolLabel] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleSave = () => {
    if (!title) return;
    const newActivity: Activity = {
      id: activity?.id || Math.random().toString(36).substr(2, 9),
      title, emoji, type,
      category: activity?.category || 'General',
      section: activity?.section || 'Allgemein',
      orderIndex: activity?.orderIndex ?? 0,
      interval: 'custom',
      customDays, description, unit, isNumberData, isMultiSelect,
      options, protocolItems,
    };
    onSave(newActivity);
  };

  const handleDelete = () => {
    if (activity && onDelete) {
      if (confirm('Möchtest du diese Aktivität wirklich löschen? Alle Logs gehen verloren.')) {
        onDelete(activity.id);
        onClose();
      }
    }
  };

  const toggleDay = (day: number) => {
    setCustomDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  const addOption = () => {
    if (!newOptionLabel) return;
    setOptions([...options, { id: Math.random().toString(36).substr(2, 7), label: newOptionLabel }]);
    setNewOptionLabel('');
  };

  const addProtocolItem = () => {
    if (!newProtocolLabel) return;
    setProtocolItems([...protocolItems, { id: Math.random().toString(36).substr(2, 7), label: newProtocolLabel, completed: false }]);
    setNewProtocolLabel('');
  };

  const updateItemLabel = (list: any[], setList: any, id: string, newLabel: string) => {
    setList(list.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const reorder = (list: any[], setList: any, dragId: string, targetId: string) => {
    const newList = [...list];
    const dragIdx = newList.findIndex(i => i.id === dragId);
    const targetIdx = newList.findIndex(i => i.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;
    const [removed] = newList.splice(dragIdx, 1);
    newList.splice(targetIdx, 0, removed);
    setList(newList);
  };

  const dayLabels = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const types: {key: ActivityType, label: string}[] = [
    {key: 'binär', label: 'Binär'},
    {key: 'zeit', label: 'Zeit'},
    {key: 'zahlen', label: 'Zahlen'},
    {key: 'auswahl', label: 'Auswahl'},
    {key: 'daten', label: 'Daten'},
    {key: 'protokoll', label: 'Protokoll'}
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl glass rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        <div className="p-8 pb-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
          <h3 className="text-3xl font-bold">{activity ? 'Aktivität bearbeiten' : 'Neue Aktivität'}</h3>
          <button onClick={onClose} className="p-2 glass rounded-full hover:bg-white/10 transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8 pb-32">
          <div className="space-y-6">
            <div className="flex gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Emoji</label>
                <button 
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="w-20 h-20 text-4xl flex items-center justify-center glass rounded-3xl hover:ring-2 ring-indigo-500 transition-all active:scale-95"
                >
                  {emoji}
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-20 px-6 text-2xl font-semibold glass rounded-3xl outline-none focus:ring-2 ring-indigo-500"
                />
              </div>
            </div>

            {isEmojiPickerOpen && (() => {
              const searchLower = emojiSearch.toLowerCase();
              const filteredEmojis = searchLower 
                ? EMOJI_DATABASE.filter(e => 
                    e.names.some(name => name.toLowerCase().includes(searchLower)) ||
                    e.emoji.includes(searchLower)
                  )
                : EMOJI_DATABASE;
              
              const groupedByCategory = searchLower 
                ? { "Suchergebnisse": filteredEmojis }
                : EMOJI_CATEGORIES;
              
              return (
                <div className="glass p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2 max-h-[500px] overflow-y-auto border border-indigo-500/20 shadow-2xl">
                <div className="relative sticky top-0 bg-transparent z-10 py-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                      type="text" placeholder="Emoji suchen (z.B. 'hund', 'essen', 'sport')..." autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl outline-none focus:ring-1 ring-indigo-500 text-slate-200"
                      value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                  />
                </div>
                  {filteredEmojis.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Keine Emojis gefunden für "{emojiSearch}"</p>
                      <p className="text-xs mt-2">Versuche andere Suchbegriffe wie 'hund', 'essen', 'sport', etc.</p>
                    </div>
                  ) : (
                    Object.entries(groupedByCategory).map(([category, emojis]) => (
                      emojis.length > 0 && (
                        <div key={category} className="space-y-3">
                          {!searchLower && (
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 sticky top-0 bg-[#030712]/80 backdrop-blur-sm py-2 z-10">
                              {category}
                            </h4>
                          )}
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {emojis.map((emojiData) => (
                              <button 
                                key={emojiData.emoji} 
                                onClick={() => { setEmoji(emojiData.emoji); setIsEmojiPickerOpen(false); }} 
                                className="text-3xl p-2 hover:bg-indigo-500/20 rounded-xl transition-all hover:scale-125 active:scale-95"
                                title={emojiData.names.join(', ')}
                              >
                                {emojiData.emoji}
                              </button>
                   ))}
                </div>
              </div>
                      )
                    ))
            )}
                </div>
              );
            })()}

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tracking Art</label>
                <div className="grid grid-cols-3 gap-2">
                  {types.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setType(t.key)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        type === t.key ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
            </div>

            {type === 'daten' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex gap-2">
                   <button onClick={() => setIsNumberData(true)} className={`flex-1 p-3 rounded-xl border transition-all ${isNumberData ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-slate-500'}`}>Zahl</button>
                   <button onClick={() => setIsNumberData(false)} className={`flex-1 p-3 rounded-xl border transition-all ${!isNumberData ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-slate-500'}`}>Text</button>
                </div>
                <input 
                  type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Einheit (z.B. kg)"
                  className="w-full p-4 glass rounded-2xl outline-none border border-white/5 focus:border-indigo-500/50"
                />
              </div>
            )}

            {type === 'auswahl' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-4 py-2">
                  <label className="text-sm font-medium text-slate-300">Mehrfachauswahl?</label>
                  <button onClick={() => setIsMultiSelect(!isMultiSelect)} className={`w-12 h-6 rounded-full relative transition-colors ${isMultiSelect ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMultiSelect ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newOptionLabel} onChange={(e) => setNewOptionLabel(e.target.value)} placeholder="Option hinzufügen..." className="flex-1 p-3 glass rounded-xl outline-none" onKeyDown={e => e.key === 'Enter' && addOption()} />
                  <button onClick={addOption} className="px-4 bg-indigo-500 text-white rounded-xl shadow-lg"><Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div 
                      key={opt.id} draggable onDragStart={() => setDraggedItemId(opt.id)} onDragOver={e => e.preventDefault()} onDrop={() => draggedItemId && reorder(options, setOptions, draggedItemId, opt.id)}
                      className="flex items-center gap-2 p-1 glass rounded-xl border border-white/5"
                    >
                      <div className="cursor-grab p-2 text-slate-600"><GripVertical size={16}/></div>
                      <input 
                        className="flex-1 bg-transparent border-none outline-none text-sm p-2" 
                        value={opt.label} 
                        onChange={(e) => updateItemLabel(options, setOptions, opt.id, e.target.value)} 
                      />
                      <button onClick={() => setOptions(options.filter(o => o.id !== opt.id))} className="p-2 text-red-400/60 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'protokoll' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex gap-2">
                  <input type="text" value={newProtocolLabel} onChange={(e) => setNewProtocolLabel(e.target.value)} placeholder="Schritt hinzufügen..." className="flex-1 p-3 glass rounded-xl outline-none" onKeyDown={e => e.key === 'Enter' && addProtocolItem()} />
                  <button onClick={addProtocolItem} className="px-4 bg-indigo-500 text-white rounded-xl shadow-lg"><Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                  {protocolItems.map((item) => (
                    <div 
                      key={item.id} draggable onDragStart={() => setDraggedItemId(item.id)} onDragOver={e => e.preventDefault()} onDrop={() => draggedItemId && reorder(protocolItems, setProtocolItems, draggedItemId, item.id)}
                      className="flex items-center gap-2 p-1 glass rounded-xl border border-white/5"
                    >
                      <div className="cursor-grab p-2 text-slate-600"><GripVertical size={16}/></div>
                      <input 
                        className="flex-1 bg-transparent border-none outline-none text-sm p-2" 
                        value={item.label} 
                        onChange={(e) => updateItemLabel(protocolItems, setProtocolItems, item.id, e.target.value)} 
                      />
                      <button onClick={() => setProtocolItems(protocolItems.filter(i => i.id !== item.id))} className="p-2 text-red-400/60 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Wiederholung</label>
              <div className="grid grid-cols-7 gap-2">
                {dayLabels.map((label, idx) => (
                  <button
                    key={label} onClick={() => toggleDay(idx)}
                    className={`p-3 rounded-2xl border transition-all text-[10px] font-black ${
                      customDays.includes(idx) ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Beschreibung</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Zusätzliche Infos..."
                className="w-full p-4 glass rounded-2xl outline-none min-h-[80px] resize-none border border-white/5"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {activity && (
              <button 
                onClick={handleDelete}
                className="flex-1 py-6 rounded-3xl bg-red-500/10 text-red-400 text-xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button 
              onClick={handleSave}
              className={`${activity ? 'flex-[3]' : 'w-full'} py-6 rounded-3xl bg-indigo-500 text-white text-xl font-bold shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3`}
            >
              Speichern
              <Check size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewActivityModal;
