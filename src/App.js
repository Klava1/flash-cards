import React, { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { data } from "./data";
import "./App.css";

function App() {
  const [cards, setCards] = useState(data);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAnswerIndex, setShowAnswerIndex] = useState(null);

  const { id, question, answer } = cards[currentCardIndex] || {
    id: "",
    question: "",
    answer: "",
  };

  const h1Ref = useRef(null);
  const containerRef = useRef(null);
  const pRef = useRef(null);
  const btnRef = useRef(null);

  useLayoutEffect(() => {
    if (h1Ref.current) {
      gsap.fromTo(
        h1Ref.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 }
      );
    }
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5 }
      );
    }
    if (pRef.current) {
      gsap.fromTo(
        pRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 }
      );
    }
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.8, opacity: 0 },
        { x: 1, opacity: 1, duration: 1.5 }
      );
    }
  }, []);

  const previousCard = () => {
    if (cards.length === 0) return;
    setCurrentCardIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : cards.length - 1
    );
  };

  const nextCard = () => {
    if (cards.length === 0) return;
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const deleteCard = (id) => {
    if (isAnimating) return;

    setIsAnimating(true);

    const currentCardElement = containerRef.current;

    gsap.to(currentCardElement, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      onComplete: () => {
        let newCards = cards.filter((card) => card.id !== id);
        setCards(newCards);

        const nextIndex = newCards.length
          ? Math.max(0, currentCardIndex % newCards.length)
          : 0;
        // currentCardIndex >= newCards.length ? 0 : currentCardIndex;
        setCurrentCardIndex(nextIndex);

        if (newCards.length > 0) {
          gsap.fromTo(
            containerRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5 }
          );
        }
        setIsAnimating(false);
      },
    });
  };

  return (
    <div className="container">
      {cards.length === 0 ? (
        <div className="container">
          <h4 className="final">NO MORE CARDS LEFT, CONGRATULATIONS!</h4>
        </div>
      ) : (
        <div className="container">
          <div>
            <h1 ref={h1Ref}>QUESTION {id}</h1>
          </div>

          <div>
            <p ref={pRef}>
              WHEN LEARNED PRESS{" "}
              <button className="btn-del" onClick={() => deleteCard(id)}>
                {" "}
                DELETE{" "}
              </button>
            </p>
          </div>

          <div ref={containerRef} className="horisontalContainer">
            <div>
              <button className="back" onClick={previousCard}>
                ← BACK
              </button>
            </div>
            {showAnswerIndex !== currentCardIndex ? (
              <div className="container card">{question}</div>
            ) : (
              <div className="container card">{answer}</div>
            )}
            <div>
              <button className="forward" onClick={nextCard}>
                FORWARD →
              </button>
            </div>
          </div>

          <div>
            <button
              ref={btnRef}
              className="btn"
              onClick={() => {
                if (showAnswerIndex === currentCardIndex) {
                  setShowAnswerIndex(null);
                } else {
                  setShowAnswerIndex(currentCardIndex);
                }
              }}
            >
              {showAnswerIndex === currentCardIndex
                ? "HIDE ANSWER"
                : "CHECK THE ANSWER"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
