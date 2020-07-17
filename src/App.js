import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
  Redirect
} from "react-router-dom";
import logo from './logo.svg';
import { syllabify, syllabifyWord } from 'syllables-ru';
import './App.css';
import raw from 'raw.macro';

function Letter({letter, color}) {
  return <span style={{color: color}}>{letter}</span>;
}

const vowel = 'аеёиоуыэюя'; // Гласные буквы
const softvowel = "еёиюя";
const voiced = 'бвгджзлмнрхцчшщ'; // Звонкие и шипящие согласные
const deaf = 'кпстф'; // Глухие согласные
const brief = 'й'; // Й
const other = 'ьъ'; // Другие
const cons = 'бвгджзйклмнпрстфхцчшщ'; // Все согласные

const wordRe = RegExp("[" + vowel + brief + other + cons + "]+", "ig")

const a = Date.now();
const eo = raw('./eo2.txt');
const words = eo.match(wordRe).map(w => w.toLocaleUpperCase());
const uniqueWords = [...new Set(words)];
const uniqueSyll = [...new Set(uniqueWords.flatMap(w => syllabifyWord(w, {separator: " "}).split(" ")))]

const b = Date.now();

function ColorLetters({text}) {
  const res = [];
  const s = syllabify(text);
  for (var i = 0; i < s.length; i++) {
    const letter = s.charAt(i);
    const ll = letter.toLowerCase();
    var color;
    if (vowel.indexOf(ll) > -1) {
      color = 'lightcoral';
    } else if (i < s.length - 1 && softvowel.indexOf(s.charAt(i+1).toLowerCase()) > -1) {
      color = "green";
    } else {
      color = "royalblue";
    }
    res.push(<Letter key={i} letter={letter} color={color}/>);
  }
  return <span className="App-letters">{res}</span>;
}

function randomInt(rnd, min, max) {
	return min + Math.floor((max - min) * rnd);
}

//const trgt = uniqueWords.filter(x=> x.length<5 && x.toLowerCase().indexOf('а') ==-1); //uniqueSyll.filter(x=>x.length>5);
const trgt = uniqueSyll.filter(x => x.length==2);
//const trgt = [...new Set(eo.toUpperCase().match(RegExp("[" + cons + "][" + vowel + "]", "ig")))]
//const trgt = [...new Set(eo.toUpperCase().match(RegExp("[" + vowel + "][" + cons + "]", "ig")))]
//const trgt = [...new Set(eo.toUpperCase().match(RegExp("([" + cons + "][" + vowel + "]|[" + vowel + "][" + cons + "])", "ig")))]
//const trgt = uniqueWords.filter(w => w.length == 4 && syllabifyWord(w, {separator: " "}).split(" ").filter(n => n.length != 2).length == 0);

function ShowWord({ary}) {
  const [rnd, setRnd] = useState(() => Math.random());
  const [cnt, setCnt] = useState(0);
  let history = useHistory();
  let { index } = useParams();

  return <>
    <ColorLetters text={trgt[index]}/><br/>
    <p style={{fontSize: "2em"}}>{index}</p>
    <button style={{fontSize: "10em"}} onClick={() => history.goBack()}>&lt;&lt;</button>
    <button style={{fontSize: "10em"}} onClick={() => { setCnt(cnt+1); history.push("/"+(1+Number(index))%trgt.length)}}>&gt;&gt;</button>
  </>;
}

//<button style={{fontSize: "10em"}} onClick={() => { setCnt(cnt+1); history.push("/"+randomInt(Math.random(), 0, trgt.length))}}>&gt;&gt;</button>
// <button style={{fontSize: "10em"}} onClick={() => { setRnd(Math.random()); setCnt(cnt+1);}}>&gt;&gt;</button>

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/:index">
            <ShowWord ary={trgt}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
