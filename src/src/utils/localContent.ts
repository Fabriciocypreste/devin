/**
 * Catálogo Local de Conteúdo RedFlix
 * 
 * Este arquivo contém o catálogo completo de filmes e séries
 * embedado diretamente no código, eliminando a necessidade de
 * buscar do GitHub.
 */

export const LOCAL_CONTENT_LIST = `The Witcher
Breaking Bad
Game of Thrones
Stranger Things
The Last of Us
House of the Dragon
The Mandalorian
Wednesday
The Boys
Peaky Blinders
Money Heist
Squid Game
Vikings
Dark
Narcos
The Crown
Ozark
Better Call Saul
Friends
The Office
Black Mirror
The Walking Dead
Lucifer
You
Arcane
Succession
Sherlock
Westworld
True Detective
The Umbrella Academy
Euphoria
The Bear
Ted Lasso
The Handmaid's Tale
See
Severance
Atlanta
Beef
Hawkeye
Yellowstone
The Rings of Power
Shogun
The Penguin
Fallout
Echo
The Gentlemen
Sugar
3 Body Problem
Ripley
Baby Reindeer
The Sympathizer
Masters of the Air
Chernobyl
The Wire
Fargo
Twin Peaks
Lost
Dexter
The Sopranos
Mad Men
Loki
WandaVision
The Falcon and the Winter Soldier
Moon Knight
She-Hulk
Ms. Marvel
Secret Invasion
What If...?
Ahsoka
Andor
The Book of Boba Fett
Obi-Wan Kenobi
The Acolyte
Foundation
Silo
For All Mankind
Pachinko
The Morning Show
Shrinking
Bad Sisters
Hijack
The Pacific
Band of Brothers
Rome
Boardwalk Empire
1883
1923
Tulsa King
Mayor of Kingstown
Special Ops: Lioness
The Terminal List
Reacher
The Marvelous Mrs. Maisel
The Expanse
The Wheel of Time
The Peripheral
Daisy Jones & The Six
Citadel
Avatar: The Last Airbender
One Piece
Cowboy Bebop
Death Note
Attack on Titan
Demon Slayer
Jujutsu Kaisen
My Hero Academia
Fullmetal Alchemist: Brotherhood
Hunter x Hunter
Naruto
Dragon Ball Z
One Punch Man
Mob Psycho 100
Tokyo Ghoul
Parasyte
Vinland Saga
Steins;Gate
Code Geass
Neon Genesis Evangelion
Bleach
Fairy Tail
Sword Art Online
Re:Zero
The Rising of the Shield Hero
Overlord
KonoSuba
That Time I Got Reincarnated as a Slime
Dr. Stone
The Promised Neverland
Erased
Violet Evergarden
The Flash
Arrow
Suits
Prison Break
24
Homeland
House
Grey's Anatomy
The Good Doctor
Chicago Fire
Law & Order: SVU
NCIS
CSI
Criminal Minds
Bones
Castle
The Mentalist
Person of Interest
Elementary
Fringe
The X-Files
Supernatural
Buffy the Vampire Slayer
Charmed
Smallville
Gotham
Titans
Doom Patrol
The Sandman
Good Omens
American Gods
His Dark Materials
The Witcher: Blood Origin
Shadow and Bone
Carnival Row
The Wheel of Time
Warrior Nun
Cursed
The Letter for the King
Cursed
Britannia
The Last Kingdom
Barbarians
Knightfall
The Musketeers
Da Vinci's Demons
Marco Polo
Into the Badlands
Banshee
Spartacus
Black Sails
Outlander
Poldark
The White Queen
The Spanish Princess
Wolf Hall
The Tudors
Versailles
Reign
The Borgias
Medici
Troy: Fall of a City
Britannia
Taboo
Peaky Blinders
Gangs of London
Top Boy
McMafia
The Night Manager
Bodyguard
Line of Duty
Luther
Broadchurch
Happy Valley
The Fall
Killing Eve
The Bridge
The Killing
Wallander
Beck
Occupied
Nobel
Borgen
The Protectors
Mammon`;

/**
 * Verifica se o conteúdo local está disponível
 */
export function hasLocalContent(): boolean {
  return LOCAL_CONTENT_LIST.length > 0;
}

/**
 * Retorna o número de itens no catálogo local
 */
export function getLocalContentCount(): number {
  return LOCAL_CONTENT_LIST.split('\n').filter(line => line.trim()).length;
}

/**
 * Retorna a lista de conteúdo local como array
 */
export function getLocalContentArray(): string[] {
  return LOCAL_CONTENT_LIST.split('\n').filter(line => line.trim());
}

/**
 * Retorna informações sobre o catálogo local
 */
export function getLocalContentInfo() {
  const items = getLocalContentArray();
  return {
    total: items.length,
    source: 'local-embedded',
    lastUpdated: '2024-11-07',
    size: LOCAL_CONTENT_LIST.length,
  };
}

/**
 * Converte lista de strings para ContentItem[] com detecção de tipo
 */
export interface ContentItem {
  name: string;
  type: 'movie' | 'tv';
}

export function getLocalContentItems(limit?: number): ContentItem[] {
  const contentArray = getLocalContentArray();
  const items = limit ? contentArray.slice(0, limit) : contentArray;
  
  // Lista de séries conhecidas
  const knownTVShows = [
    'breaking bad', 'game of thrones', 'stranger things', 'the witcher',
    'the last of us', 'house of the dragon', 'the mandalorian', 'wednesday',
    'the boys', 'peaky blinders', 'money heist', 'squid game', 'vikings',
    'dark', 'narcos', 'the crown', 'ozark', 'better call saul', 'friends',
    'the office', 'black mirror', 'the walking dead', 'lucifer', 'you',
    'arcane', 'succession', 'sherlock', 'westworld', 'true detective',
    'chernobyl', 'the wire', 'fargo', 'twin peaks', 'lost', 'dexter',
    'the sopranos', 'mad men', 'loki', 'foundation', 'silo', 'reacher'
  ];
  
  return items.map(name => {
    const lowerName = name.toLowerCase();
    const isTVShow = knownTVShows.some(show => lowerName.includes(show));
    
    return {
      name: name,
      type: isTVShow ? 'tv' : 'tv' // Default to TV (maioria é série)
    };
  });
}
