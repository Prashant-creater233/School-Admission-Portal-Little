import { CLASSES, GENDERS } from "./constants";
const s = (v, n = 200) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, n);
export function validate(b) {
  const d = {
    studentName: s(b.studentName, 80), dob: s(b.dob, 10), gender: s(b.gender, 10), classApplied: s(b.classApplied, 20),
    parentName: s(b.parentName, 80), phone: String(b.phone ?? "").replace(/\D/g, "").slice(-10),
    email: s(b.email, 120).toLowerCase(), address: s(b.address, 300), previousSchool: s(b.previousSchool, 120),
    message: String(b.message ?? "").trim().slice(0, 600),
  };
  const e = {};
  if (d.studentName.length < 2) e.studentName = "Enter the child's full name.";
  const t = new Date(d.dob);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.dob) || isNaN(t) || t > new Date() || t < new Date(Date.now() - 12 * 31557600000))
    e.dob = "Enter a valid date of birth.";
  if (!GENDERS.includes(d.gender)) e.gender = "Select one option.";
  if (!CLASSES.includes(d.classApplied)) e.classApplied = "Select a class.";
  if (d.parentName.length < 2) e.parentName = "Enter the parent or guardian's name.";
  if (!/^[6-9]\d{9}$/.test(d.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) e.email = "Enter a valid email address.";
  if (d.address.length < 8) e.address = "Enter the full home address.";
  return Object.keys(e).length ? { errors: e } : { data: d };
}
