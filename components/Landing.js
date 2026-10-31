"use client";
import { useState } from "react";
import { motion } from "framer-motion";
const SCHOOL = "Little Hearts Pre Primary School";
const ADDRESS = "LHPG, near RR Hospital, New Delhi";
const programs = [
  ["Playgroup", "2 to 3 years", "First steps away from home: songs, sensory play and gentle routines.", "#ffb627"],
  ["Nursery", "3 to 4 years", "Colours, shapes, early words and plenty of story time.", "#2f9461"],
  ["LKG", "4 to 5 years", "Phonics, counting and hands-on activities that build confidence.", "#ff6b57"],
  ["UKG", "5 to 6 years", "Reading, writing and number sense, ready for Class 1.", "#4aa8e0"],
];
const why = [
  ["Safe, caring campus", "CCTV-monitored rooms and trained, child-friendly staff."],
  ["Learning through play", "Activity-based teaching instead of pressure and heavy bags."],
  ["Small classes", "Every child gets noticed, heard and encouraged."],
  ["Parents stay in the loop", "Regular updates and an open door for your questions."],
];
const how = [
  ["Fill the form", "Three short steps, about three minutes."],
  ["We call you", "The school office contacts you within 2 working days."],
  ["Visit and confirm", "Meet the teachers, see the classrooms and complete admission."],
];
const faq = [
  ["Is there a fee to apply?", "No. Applying online is free. Fee details are shared when the school office calls you."],
  ["Which age is right for which class?", "Playgroup starts at 2 years, Nursery at 3, LKG at 4 and UKG at 5. The office will help you pick."],
  ["Can I change my details after submitting?", "Yes. Call the school office with your application number."],
  ["Can I visit the school first?", "Of course. Mention it in the form and we will book a campus tour."],
];
const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: .5 } };
export default function Landing() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <header className="nav"><div className="wrap row">
        <a href="#" className="brand"><img src="/logo.png" alt="" className="logo-img" />{SCHOOL}</a>
        <nav className="links"><a href="#programs">Classes</a><a href="#why">Why us</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav>
        <a className="btn sm" href="/apply">Apply now</a>
      </div></header>

      <section className="hero">
        <motion.span className="blob b1" animate={{ y: [0, -28, 0], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="blob b2" animate={{ y: [0, 24, 0], x: [0, 14, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="blob b3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <div className="wrap hero-grid">
          <div className="hero-in">
            <motion.p className="pill" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>Admissions open for 2027</motion.p>
            <h1>
              {["Where", "little", "hearts", "start", "to", "bloom."].map((w, i) => (
                <motion.span key={i} style={{ display: "inline-block", marginRight: ".28em" }} initial={{ opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: .15 + i * .09, type: "spring", stiffness: 110, damping: 14 }}>{w}</motion.span>
              ))}
            </h1>
            <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}>
              A safe, joyful first school where your child learns through play, stories and friends. Apply online in about three minutes.
            </motion.p>
            <motion.div className="cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <a className="btn" href="/apply">Start application</a>
              <a className="btn ghost" href="#programs">See our classes</a>
            </motion.div>
          </div>
          <motion.div className="badge" initial={{ opacity: 0, scale: .6, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .4, type: "spring", stiffness: 70, damping: 12 }}>
            <i className="ring" /><img src="/logo.png" alt="Little Hearts Pre Primary School logo" />
          </motion.div>
        </div>
      </section>

      <section className="wrap facts">
        {[["Ages 2 to 6", "Playgroup to UKG"], ["Small classes", "Personal attention"], ["9 am to 1 pm", "Daily school hours"], ["Free campus visit", "Book with the form"]].map(([a, b]) => (
          <motion.div className="card fact" key={a} whileHover={{ y: -6, rotate: -1 }}><strong>{a}</strong><span className="muted">{b}</span></motion.div>
        ))}
      </section>

      <section id="programs" className="wrap sec">
        <motion.div {...fade}><h2>Classes for every little step</h2><p className="muted sub">From the first day away from home to being ready for Class 1.</p></motion.div>
        <div className="progs">
          {programs.map(([n, age, d, c], i) => (
            <motion.div key={n} className="card prog" style={{ "--c": c }} {...fade} transition={{ duration: .5, delay: i * .08 }} whileHover={{ y: -8 }}>
              <span className="dot" /><h3>{n}</h3><b>{age}</b><p className="muted">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="why" className="band"><div className="wrap sec">
        <motion.h2 {...fade}>Why parents choose us</motion.h2>
        <div className="whys">
          {why.map(([t, d], i) => (
            <motion.div key={t} {...fade} transition={{ duration: .5, delay: i * .08 }}><h3>{t}</h3><p>{d}</p></motion.div>
          ))}
        </div>
      </div></section>

      <section className="wrap sec">
        <motion.h2 {...fade}>How admission works</motion.h2>
        <ol className="how">
          {how.map(([t, d], i) => (
            <motion.li key={t} {...fade} transition={{ duration: .5, delay: i * .1 }}><b>{i + 1}</b><div><h3>{t}</h3><p className="muted">{d}</p></div></motion.li>
          ))}
        </ol>
      </section>

      <section id="apply" className="wrap">
        <motion.div className="ctaband" {...fade}>
          <img src="/logo.png" alt="" />
          <div><h2>Give your child a joyful start</h2><p>Admissions for 2027 are open. Apply online in three minutes.</p></div>
          <a className="btn" href="/apply">Apply for admission</a>
        </motion.div>
      </section>

      <section id="contact" className="wrap sec">
        <motion.div className="card contact" {...fade}>
          <div><h2>Visit our school</h2><p className="muted">Walk in, meet our teachers and see the classrooms.</p></div>
          <div className="addr dark"><b>Address</b><span>{ADDRESS}</span><a className="btn ghost sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}>Open in Maps</a></div>
        </motion.div>
      </section>

      <section id="faq" className="wrap sec narrow">
        <motion.h2 {...fade}>Questions parents ask</motion.h2>
        {faq.map(([q, a], i) => (
          <div key={q} className={`qa ${open === i ? "open" : ""}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<span>+</span></button>
            <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="ans"><p className="muted">{a}</p></motion.div>
          </div>
        ))}
      </section>

      <footer className="foot"><div className="wrap row">
        <span className="brand light"><img src="/logo.png" alt="" className="logo-img" />{SCHOOL}</span>
        <span>{ADDRESS}</span>
        <a href="/admin/login">Staff login</a>
      </div></footer>
    </>
  );
}
