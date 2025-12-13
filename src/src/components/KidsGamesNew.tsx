import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "../utils/motion-stub";

// Icons inline to avoid lucide-react dependency
const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Sparkles = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

interface KidsGamesProps {
  onClose: () => void;
}

export function KidsGames({ onClose }: KidsGamesProps) {
  const [selectedGame, setSelectedGame] = useState<
    "memory" | "whackamole" | "puzzle" | "simon" | "math" | "catch" | null
  >(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 z-50 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-6xl"
            >
              🎮
            </motion.div>
            <div>
              <h1 className="text-5xl font-black text-white drop-shadow-lg">
                Kids Games 🌟
              </h1>
              <p className="text-white/90 text-lg mt-1">
                6 Jogos Divertidos e Educativos!
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full transition-all shadow-2xl border-2 border-white/50"
          >
            <X className="w-8 h-8 text-white" />
          </motion.button>
        </div>

        {/* Score Display */}
        {score > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 flex justify-center gap-4"
          >
            <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border-2 border-white/50">
              <span className="text-white font-black text-xl">
                ⭐ Pontos: {score}
              </span>
            </div>
            {highScore > 0 && (
              <div className="px-6 py-3 bg-yellow-400/90 backdrop-blur-lg rounded-full border-2 border-yellow-300">
                <span className="text-purple-900 font-black text-xl">
                  🏆 Recorde: {highScore}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Game Selection or Active Game */}
        {!selectedGame ? (
          <GameSelection onSelectGame={setSelectedGame} />
        ) : selectedGame === "memory" ? (
          <MemoryGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        ) : selectedGame === "whackamole" ? (
          <WhackAMoleGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        ) : selectedGame === "puzzle" ? (
          <PuzzleGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        ) : selectedGame === "simon" ? (
          <SimonGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        ) : selectedGame === "math" ? (
          <MathGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        ) : (
          <CatchGame
            onBack={() => setSelectedGame(null)}
            score={score}
            setScore={setScore}
            highScore={highScore}
            setHighScore={setHighScore}
          />
        )}
      </div>
    </motion.div>
  );
}

// Game Selection Menu
function GameSelection({
  onSelectGame,
}: {
  onSelectGame: (
    game: "memory" | "whackamole" | "puzzle" | "simon" | "math" | "catch",
  ) => void;
}) {
  const games = [
    {
      id: "memory" as const,
      name: "Jogo da Memória",
      emoji: "🧠",
      color: "from-blue-400 to-cyan-400",
      description: "Encontre os pares!",
    },
    {
      id: "whackamole" as const,
      name: "Acerte o Emoji",
      emoji: "🎯",
      color: "from-green-400 to-emerald-400",
      description: "Clique rápido!",
    },
    {
      id: "puzzle" as const,
      name: "Quebra-Cabeça",
      emoji: "🧩",
      color: "from-pink-400 to-rose-400",
      description: "Organize as cores!",
    },
    {
      id: "simon" as const,
      name: "Simon Diz",
      emoji: "🎨",
      color: "from-purple-400 to-violet-400",
      description: "Repita a sequência!",
    },
    {
      id: "math" as const,
      name: "Matemática Divertida",
      emoji: "🔢",
      color: "from-orange-400 to-red-400",
      description: "Resolva contas!",
    },
    {
      id: "catch" as const,
      name: "Pegue as Estrelas",
      emoji: "⭐",
      color: "from-yellow-400 to-amber-400",
      description: "Capture as estrelas!",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game, index) => (
        <motion.button
          key={game.id}
          onClick={() => onSelectGame(game.id)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          className={`p-8 rounded-3xl bg-gradient-to-br ${game.color} shadow-2xl border-4 border-white/50 hover:border-white transition-all relative overflow-hidden group`}
        >
          {/* Sparkle Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              {game.emoji}
            </motion.div>
            <h3 className="text-white font-black text-2xl mb-2">
              {game.name}
            </h3>
            <p className="text-white/90 font-bold">
              {game.description}
            </p>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full inline-flex items-center gap-2 text-white font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Jogar Agora
            </motion.div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// Memory Game Component
function MemoryGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const emojis = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
  ];
  const [cards, setCards] = useState<
    {
      emoji: string;
      id: number;
      flipped: boolean;
      matched: boolean;
    }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<
    number[]
  >([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        emoji,
        id: index,
        flipped: false,
        matched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMoves(0);
    setGameWon(false);
    setScore(0);
  };

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].flipped ||
      cards[index].matched
    )
      return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (
        cards[firstIndex].emoji === cards[secondIndex].emoji
      ) {
        // Match found!
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].matched = true;
          updatedCards[secondIndex].matched = true;
          setCards(updatedCards);
          setFlippedIndices([]);

          const newScore = score + 10;
          setScore(newScore);

          if (updatedCards.every((card) => card.matched)) {
            setGameWon(true);
            if (newScore > highScore) {
              setHighScore(newScore);
            }
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold border-2 border-white/50">
          🎯 Movimentos: {moves}
        </div>
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          🔄 Novo Jogo
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: card.matched ? 1 : 1.05 }}
            whileTap={{ scale: card.matched ? 1 : 0.95 }}
            className={`aspect-square rounded-2xl text-6xl flex items-center justify-center font-bold transition-all border-4 ${
              card.matched
                ? "bg-green-400 border-green-300 opacity-50"
                : card.flipped
                  ? "bg-white border-white shadow-2xl"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 hover:border-white"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </motion.button>
        ))}
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-9xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-5xl font-black text-white mb-4">
                Você Venceu!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Parabéns! 🎉 Você completou em {moves}{" "}
                movimentos!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={initializeGame}
                  className="px-8 py-4 bg-white rounded-full text-purple-700 font-black text-xl hover:bg-purple-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-purple-600 rounded-full text-white font-black text-xl hover:bg-purple-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Whack-a-Mole Style Game
function WhackAMoleGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const [activeHoles, setActiveHoles] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const emojis = [
    "🐰",
    "🐻",
    "🐼",
    "🐯",
    "🦁",
    "🐵",
    "🐶",
    "🐱",
    "🦊",
  ];

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(
        () => setTimeLeft(timeLeft - 1),
        1000,
      );
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const numHoles = Math.floor(Math.random() * 3) + 1;
        const holes = Array.from({ length: numHoles }, () =>
          Math.floor(Math.random() * 9),
        );
        setActiveHoles(holes);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
  };

  const handleHoleClick = (index: number) => {
    if (activeHoles.includes(index)) {
      setScore(score + 5);
      setActiveHoles(activeHoles.filter((h) => h !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold text-2xl border-2 border-white/50">
          ⏰ {timeLeft}s
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          {isPlaying ? "🔄 Reiniciar" : "▶️ Começar"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
        {Array.from({ length: 9 }).map((_, index) => {
          const isActive = activeHoles.includes(index);
          const randomEmoji =
            emojis[Math.floor(Math.random() * emojis.length)];

          return (
            <motion.button
              key={index}
              onClick={() => handleHoleClick(index)}
              whileHover={{ scale: isActive ? 1.1 : 1 }}
              whileTap={{ scale: isActive ? 0.9 : 1 }}
              className={`aspect-square rounded-3xl text-7xl flex items-center justify-center transition-all border-4 ${
                isActive
                  ? "bg-gradient-to-br from-yellow-400 to-orange-400 border-yellow-300 shadow-2xl animate-pulse"
                  : "bg-gradient-to-br from-brown-600 to-brown-800 border-brown-700"
              }`}
            >
              {isActive ? (
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 50 }}
                >
                  {randomEmoji}
                </motion.div>
              ) : (
                "🕳️"
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <div className="text-9xl mb-4">🎯</div>
              <h2 className="text-5xl font-black text-white mb-4">
                Tempo Esgotado!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Você fez {score} pontos! 🌟
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-white rounded-full text-green-700 font-black text-xl hover:bg-green-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-green-600 rounded-full text-white font-black text-xl hover:bg-green-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Color Puzzle Game
function PuzzleGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
  ];
  const [tiles, setTiles] = useState<string[]>([]);
  const [selectedTile, setSelectedTile] = useState<
    number | null
  >(null);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...colors, ...colors].sort(
      () => Math.random() - 0.5,
    );
    setTiles(shuffled);
    setSelectedTile(null);
    setMoves(0);
    setIsSolved(false);
    setScore(0);
  };

  const handleTileClick = (index: number) => {
    if (selectedTile === null) {
      setSelectedTile(index);
    } else if (selectedTile === index) {
      setSelectedTile(null);
    } else {
      // Swap tiles
      const newTiles = [...tiles];
      [newTiles[selectedTile], newTiles[index]] = [
        newTiles[index],
        newTiles[selectedTile],
      ];
      setTiles(newTiles);
      setSelectedTile(null);
      setMoves(moves + 1);

      // Check if sorted
      const sortedColors = [...colors, ...colors].sort();
      if (
        JSON.stringify(newTiles) ===
        JSON.stringify(sortedColors)
      ) {
        setIsSolved(true);
        const newScore = Math.max(100 - moves * 5, 10);
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold border-2 border-white/50">
          🎯 Movimentos: {moves}
        </div>
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          🔄 Novo Jogo
        </button>
      </div>

      <div className="text-center mb-4">
        <p className="text-white font-bold text-xl">
          🧩 Organize as cores iguais lado a lado!
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {tiles.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => handleTileClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-2xl ${color} transition-all border-4 ${
              selectedTile === index
                ? "border-white shadow-2xl scale-105"
                : "border-white/50"
            }`}
          />
        ))}
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <div className="text-9xl mb-4">🎉</div>
              <h2 className="text-5xl font-black text-white mb-4">
                Parabéns!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Você resolveu em {moves} movimentos! 🧩
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={initializeGame}
                  className="px-8 py-4 bg-white rounded-full text-pink-700 font-black text-xl hover:bg-pink-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-pink-600 rounded-full text-white font-black text-xl hover:bg-pink-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simon Says Game
function SimonGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const colors = [
    { id: "red", bg: "bg-red-500", glow: "shadow-red-500" },
    { id: "blue", bg: "bg-blue-500", glow: "shadow-blue-500" },
    { id: "green", bg: "bg-green-500", glow: "shadow-green-500" },
    { id: "yellow", bg: "bg-yellow-500", glow: "shadow-yellow-500" },
  ];

  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const addToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, randomColor.id];
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlaying(true);
    for (const color of seq) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setActiveColor(color);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveColor(null);
    }
    setIsPlaying(false);
  };

  const handleColorClick = (colorId: string) => {
    if (isPlaying) return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 300);

    if (colorId !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 10;
      setScore(newScore);
      setPlayerSequence([]);
      setTimeout(() => addToSequence(), 1000);
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setTimeout(() => addToSequence(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold border-2 border-white/50">
          🎨 Nível: {sequence.length}
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          {gameStarted ? "🔄 Reiniciar" : "▶️ Começar"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {colors.map((color) => (
          <motion.button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            disabled={isPlaying || !gameStarted}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-3xl ${color.bg} transition-all border-4 border-white/50 ${
              activeColor === color.id
                ? `${color.glow} shadow-2xl scale-105`
                : ""
            } ${isPlaying || !gameStarted ? "opacity-50" : "hover:scale-105"}`}
          />
        ))}
      </div>

      {!gameStarted && (
        <div className="text-center">
          <p className="text-white font-bold text-xl">
            🎨 Repita a sequência de cores!
          </p>
        </div>
      )}

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-purple-400 to-violet-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <div className="text-9xl mb-4">😢</div>
              <h2 className="text-5xl font-black text-white mb-4">
                Ops! Errou!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Você chegou ao nível {sequence.length}! 🎨
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-white rounded-full text-purple-700 font-black text-xl hover:bg-purple-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-purple-600 rounded-full text-white font-black text-xl hover:bg-purple-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Math Game
function MathGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState("+");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const generateQuestion = () => {
    const operations = ["+", "-", "×"];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;

    if (op === "-") {
      if (n1 < n2) [n1, n2] = [n2, n1];
    }

    setNum1(n1);
    setNum2(n2);
    setOperation(op);
    setAnswer("");
    setFeedback(null);
  };

  const getCorrectAnswer = () => {
    if (operation === "+") return num1 + num2;
    if (operation === "-") return num1 - num2;
    if (operation === "×") return num1 * num2;
    return 0;
  };

  const checkAnswer = () => {
    const correct = getCorrectAnswer();
    if (parseInt(answer) === correct) {
      setScore(score + 10);
      setFeedback("correct");
      setTimeout(() => generateQuestion(), 500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameOver(false);
    generateQuestion();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold text-2xl border-2 border-white/50">
          ⏰ {timeLeft}s
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          {isPlaying ? "🔄 Reiniciar" : "▶️ Começar"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        {isPlaying ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-white/30 text-center">
            <div className="text-8xl font-black text-white mb-8">
              {num1} {operation} {num2} = ?
            </div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
              className="w-full max-w-xs px-8 py-6 text-5xl font-black text-center rounded-2xl border-4 border-white/50 bg-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
              placeholder="?"
              autoFocus
            />
            <button
              onClick={checkAnswer}
              className="mt-6 px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full text-white font-black text-2xl hover:scale-105 transition-all shadow-2xl"
            >
              ✓ Confirmar
            </button>

            {feedback === "correct" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-6 text-6xl"
              >
                ✅
              </motion.div>
            )}
            {feedback === "wrong" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-6 text-6xl"
              >
                ❌
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white font-bold text-xl">
              🔢 Resolva o máximo de contas em 60 segundos!
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <div className="text-9xl mb-4">🎓</div>
              <h2 className="text-5xl font-black text-white mb-4">
                Tempo Esgotado!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Você fez {score} pontos! 🔢
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-white rounded-full text-orange-700 font-black text-xl hover:bg-orange-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-orange-600 rounded-full text-white font-black text-xl hover:bg-orange-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Catch the Stars Game
function CatchGame({
  onBack,
  score,
  setScore,
  highScore,
  setHighScore,
}: any) {
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const emojis = ["⭐", "🌟", "💫", "✨", "🌠"];

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newStar = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -10,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
        setStars((prev) => [...prev, newStar]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setStars((prev) =>
          prev
            .map((star) => ({ ...star, y: star.y + 2 }))
            .filter((star) => star.y < 100)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const catchStar = (id: number) => {
    setStars((prev) => prev.filter((star) => star.id !== id));
    setScore(score + 5);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setStars([]);
    setIsPlaying(true);
    setGameOver(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold hover:bg-white/30 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold text-2xl border-2 border-white/50">
          ⏰ {timeLeft}s
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-lg rounded-full text-white font-bold hover:bg-green-600/80 transition-all border-2 border-white/50"
        >
          {isPlaying ? "🔄 Reiniciar" : "▶️ Começar"}
        </button>
      </div>

      <div className="relative w-full h-[500px] bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl border-4 border-white/30 overflow-hidden">
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-bold text-2xl text-center px-4">
              ⭐ Clique nas estrelas que caem!
            </p>
          </div>
        )}

        {stars.map((star) => (
          <motion.button
            key={star.id}
            onClick={() => catchStar(star.id)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute text-6xl cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
          >
            {star.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-3xl p-12 shadow-2xl border-4 border-white text-center">
              <div className="text-9xl mb-4">⭐</div>
              <h2 className="text-5xl font-black text-white mb-4">
                Fim de Jogo!
              </h2>
              <p className="text-2xl text-white/90 mb-6">
                Você pegou {score / 5} estrelas! ⭐
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-white rounded-full text-yellow-700 font-black text-xl hover:bg-yellow-100 transition-all shadow-xl"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-4 bg-yellow-600 rounded-full text-white font-black text-xl hover:bg-yellow-700 transition-all shadow-xl"
                >
                  📋 Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
