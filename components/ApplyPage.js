"use client";
import { motion } from "framer-motion";
import ApplyForm from "./ApplyForm";
export default function ApplyPage() {
  return (
    <div className="ap">
      <aside className="ap-side">
        <span className="ap-blob" />
        <a href="/" className="back">← Back to home</a>
        <motion.div className="ap-badge" initial={{ opacity: 0, scale: .7, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
          <img src="/logo.png" alt="Little Hearts Pre Primary School logo" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>Begin your child&rsquo;s first chapter</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}>Three short steps, about three minutes. Our office will call you within 2 working days.</motion.p>
        <ul className="ticks light">
          <li>Free to apply, no payment needed</li>
          <li>Your details stay private</li>
          <li>Free campus visit on request</li>
        </ul>
        <div className="addr"><b>Visit us</b><span>LHPG, near RR Hospital, New Delhi</span></div>
      </aside>
      <main className="ap-main">
        <motion.div className="ap-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .5 }}>
          <p className="pill dark">Admission 2027</p>
          <h2>Application form</h2>
          <ApplyForm />
        </motion.div>
      </main>
    </div>
  );
}
