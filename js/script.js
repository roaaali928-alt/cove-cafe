
"use strict";
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get("lang")||"en";
const tr=(en,ar)=>lang==="ar"?ar:en;

function applyLang(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-ar]").forEach(el=>{
    if(!el.dataset.en)el.dataset.en=el.textContent;
    el.textContent=lang==="ar"?el.dataset.ar:el.dataset.en;
  });
  const b=document.getElementById("langBtn");
  if(b)b.textContent=lang==="ar"?"English":"العربية";
  store.set("lang",lang);
}
function show(form,text,ok){const m=form.querySelector(".msg");m.textContent=text;m.className="msg "+(ok?"ok":"err");}
const users=()=>{try{return JSON.parse(store.get("users")||"[]")}catch(e){return[]}};
const validEmail=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

document.addEventListener("DOMContentLoaded",()=>{
  applyLang();
  document.getElementById("langBtn").addEventListener("click",()=>{lang=lang==="ar"?"en":"ar";applyLang();});
  document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));

  const contact=document.getElementById("contactForm");
  if(contact)contact.addEventListener("submit",e=>{
    e.preventDefault();
    if(!contact.cn.value.trim()||!validEmail(contact.ce.value.trim())||!contact.cm.value.trim())
      return show(contact,tr("Please fill all fields with a valid email.","من فضلك املأ كل الحقول ببريد صحيح."),false);
    show(contact,tr("Thank you! We will reply soon.","شكرا لك! سنرد عليك قريبا."),true);contact.reset();
  });

  const signup=document.getElementById("signupForm");
  if(signup)signup.addEventListener("submit",e=>{
    e.preventDefault();
    const name=signup["su-n"].value.trim(),email=signup["su-e"].value.trim().toLowerCase(),p=signup["su-p"].value;
    if(!name||!validEmail(email))return show(signup,tr("Enter your name and a valid email.","اكتب اسمك وبريدا صحيحا."),false);
    if(p.length<6)return show(signup,tr("Password must be at least 6 characters.","كلمة المرور 6 أحرف على الأقل."),false);
    if(p!==signup["su-c"].value)return show(signup,tr("Passwords do not match.","كلمتا المرور غير متطابقتين."),false);
    const list=users();
    if(list.some(u=>u.email===email))return show(signup,tr("This email is already registered.","هذا البريد مسجل بالفعل."),false);
    list.push({name,email,p});store.set("users",JSON.stringify(list));
    show(signup,tr("Account created. You can sign in now.","تم إنشاء الحساب. يمكنك الدخول الآن."),true);signup.reset();
  });

  const signin=document.getElementById("signinForm");
  if(signin)signin.addEventListener("submit",e=>{
    e.preventDefault();
    const email=signin["si-e"].value.trim().toLowerCase(),p=signin["si-p"].value;
    const u=users().find(x=>x.email===email&&x.p===p);
    u?show(signin,tr("Welcome back, "+u.name+"!","أهلا بعودتك يا "+u.name+"!"),true)
     :show(signin,tr("Wrong email or password.","البريد أو كلمة المرور غير صحيحة."),false);
  });
});
