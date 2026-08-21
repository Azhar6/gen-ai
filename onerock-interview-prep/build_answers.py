"""Turn stored Q&A into question + detailed answer. Drop interview coaching."""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent

COACH = re.compile(
    r"interview(?:er|s)?|out loud|they want|they ask|they expect|"
    r"you sound junior|say this|practice this|red flag|"
    r"named on many JDs|5-year signal|coding round|vibe checks|"
    r"perfect interview|key sentence for the interview|"
    r"how to answer|say in the",
    re.I,
)


def split_sents(text):
    text = (text or "").strip()
    if not text:
        return []
    return [p.strip() for p in re.split(r"(?<=[.!?])\s+", text) if p.strip()]


def clean_text(text):
    if not text:
        return ""
    t = str(text).strip()
    t = re.sub(r"(?i)\bI would\b", "The usual design is to", t, count=1)
    t = re.sub(r"(?i)\bI would\b", "then", t)
    t = re.sub(r"(?i)\bI keep\b", "Keep", t)
    t = re.sub(r"(?i)\bI use\b", "Use", t)
    t = re.sub(r"(?i)\bI prefer\b", "A solid default is", t)
    t = re.sub(r"(?i)\bI start\b", "Start", t)
    t = re.sub(r"(?i)\bI do not\b", "Do not", t)
    t = re.sub(r"(?i)\bI never\b", "Never", t)
    t = re.sub(r"(?i)\bI will\b", "", t)
    t = re.sub(r"(?i)\bin the interview\b", "", t)
    t = re.sub(r"(?i)\byou can say out loud\b", "", t)
    t = re.sub(r"(?i)\bsay out loud\b", "", t)
    kept = [s for s in split_sents(t) if s and not COACH.search(s)]
    t = " ".join(kept).strip()
    t = re.sub(r"\s+", " ", t).strip(" ,;:-")
    return t


def uniq_paras(paras):
    out, seen = [], set()
    for p in paras:
        p = clean_text(p) if not isinstance(p, str) else clean_text(p)
        if not p or len(p) < 8:
            continue
        key = re.sub(r"\W+", " ", p.lower()).strip()
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
    return out


def keep_item(text):
    t = clean_text(text)
    if not t:
        return False
    if t.lower().startswith("always say"):
        return False
    return True


def detailed_answer(q):
    paras = []
    paras.append(q.get("oneLiner") or "")
    paras.extend(q.get("simpleAnswer") or [])

    why = q.get("whyItMatters") or ""
    why_keep = " ".join(s for s in split_sents(why) if not COACH.search(s))
    if why_keep:
        paras.append(why_keep)

    say = q.get("sayInInterview") or ""
    if say:
        paras.append(say)

    layers = (q.get("architecture") or {}).get("layers") or []
    if layers:
        paras.append("Here is how the pieces fit together.")
        for layer in layers:
            name = (layer.get("name") or "").strip()
            what = (layer.get("what") or "").strip()
            if name and what:
                paras.append(name + ": " + what)

    for item in q.get("whyThisDesign") or []:
        if keep_item(item):
            paras.append(item)

    tech_fail = []
    for f in q.get("failures") or []:
        blob = " ".join([f.get("case") or "", f.get("whatHappens") or "", f.get("fix") or ""])
        if COACH.search(blob):
            continue
        case, happens, fix = f.get("case"), f.get("whatHappens"), f.get("fix")
        if case and happens and fix:
            tech_fail.append("If " + case + ", then " + happens + " Fix: " + fix + ".")
    if tech_fail:
        paras.append("Watch-outs in real systems:")
        paras.extend(tech_fail)

    for item in q.get("production") or []:
        if keep_item(item) and "laptop" not in item.lower():
            paras.append(item)

    return uniq_paras(paras)


def clean_table(table):
    if not table:
        return table
    table = dict(table)
    table["title"] = clean_text(table.get("title") or "") or table.get("title")
    rows = []
    for row in table.get("rows") or []:
        rows.append([clean_text(c) or c for c in row])
    table["rows"] = rows
    return table


def clean_example(ex):
    if not ex:
        return None
    ex = dict(ex)
    story = clean_text(ex.get("story") or "")
    if story:
        ex["story"] = story
    else:
        ex.pop("story", None)
    if ex.get("walkthrough"):
        walk = []
        for w in ex["walkthrough"]:
            w = dict(w)
            w["detail"] = clean_text(w.get("detail") or "") or w.get("detail")
            walk.append(w)
        ex["walkthrough"] = walk
    if ex.get("tables"):
        ex["tables"] = [clean_table(t) for t in ex["tables"]]
    if not any(ex.get(k) for k in ("story", "walkthrough", "code", "tables", "agentOutput")):
        return None
    if ex.get("title") in ("Worked example",):
        ex["title"] = "Example"
    return ex


DROP = {
    "whyItMatters",
    "sayInInterview",
    "failures",
    "production",
    "whyThisDesign",
    "timeToAnswer",
}


def transform_question(q):
    q = dict(q)
    q["answer"] = detailed_answer(q)
    q["simpleAnswer"] = q["answer"]
    if q.get("tables"):
        q["tables"] = [clean_table(t) for t in q["tables"]]
    if q.get("example"):
        ex = clean_example(q["example"])
        if ex:
            q["example"] = ex
        else:
            q.pop("example", None)
    arch = q.get("architecture")
    if arch and arch.get("title") == "How to think about it":
        arch = dict(arch)
        arch["title"] = "How it works"
        q["architecture"] = arch
    for k in DROP:
        q.pop(k, None)
    return q


def rewrite_file(path, is_base):
    data = json.loads(path.read_text(encoding="utf-8"))
    if is_base:
        data["meta"]["packTitle"] = "Question library"
        data["meta"]["howToUse"] = "Open a topic. Read the question and the detailed answer."
        data["meta"]["language"] = "simple English"
        if data.get("playlists"):
            data["playlists"][0]["blurb"] = "Start with these 15 questions."
        for sec in data.get("sections") or []:
            if sec.get("id") == "agents":
                sec["blurb"] = "Agents, tools, state, and control."
        data["questions"] = [transform_question(q) for q in data["questions"]]
    else:
        data["questions"] = [transform_question(q) for q in data["questions"]]
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


def main():
    base = rewrite_file(ROOT / "questions.json", True)
    rest = rewrite_file(ROOT / "questions-rest.json", False)
    combined = dict(base)
    combined["questions"] = base["questions"] + rest["questions"]
    counts = Counter(q["sectionId"] for q in combined["questions"])
    for sec in combined.get("sections") or []:
        n = counts.get(sec["id"], 0)
        sec["expected"] = max(sec.get("expected") or 0, n)
    (ROOT / "questions-data.js").write_text(
        "window.QA_DATA = " + json.dumps(combined, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    lens = [len(" ".join(q.get("answer") or [])) for q in combined["questions"]]
    print("questions", len(combined["questions"]))
    print("avg answer chars", round(sum(lens) / len(lens)))
    print("min/max", min(lens), max(lens))


if __name__ == "__main__":
    main()
