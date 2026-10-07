'use strict';
// Sustituye este número de ejemplo por el número internacional del restaurante.
// Incluye código de país, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = '18494471493';
const MENU = {
 entradas: [['Provoleta A La Brasa','Queso fundido, tomates asados, orégano y pan de la casa.',38,'Para Compartir'],['Croquetas De Hongos','Croquetas cremosas con alioli de ajo asado.',32,'Vegetariano'],['Vegetales Al Fuego','Vegetales de temporada con aceite de hierbas.',30,'Vegetariano'],['Papas Bravas','Papas doradas con salsa especiada y crema de ajo.',26,'Un Buen Comienzo']],
 fuertes: [['Corte De La Casa','Carne a la brasa, papas rústicas y chimichurri.',98,'Selección Brasa 27'],['Pollo Al Fuego','Pollo marinado con cítricos, puré y vegetales.',64,'Sabor De Casa'],['Costillas A Fuego Lento','Costillas glaseadas, ensalada y papas doradas.',86,'Cocción Lenta'],['Risotto De Hongos','Arroz cremoso, hongos salteados y queso curado.',56,'Vegetariano']],
 hamburguesas: [['Hamburguesa Brasa 27','Pan brioche, carne a la parrilla, queso y cebolla caramelizada.',58,'Selección Brasa 27'],['Hamburguesa Ahumada','Carne a la brasa, queso, tocino y salsa ahumada.',62,'Sabor Intenso'],['Hamburguesa Del Huerto','Medallón de legumbres, vegetales y salsa de hierbas.',48,'Vegetariano'],['Hamburguesa Clásica','Carne a la parrilla, lechuga, tomate y queso.',45,'Con Papas Rústicas']],
 bebidas: [['Limonada De La Casa','Limón, hierbabuena y un toque de jengibre.',18,'Sin Alcohol'],['Frutos Rojos Y Romero','Frutos rojos, romero y agua con gas.',22,'Sin Alcohol'],['Té Frío De Durazno','Infusión fría con durazno y cítricos.',16,'Sin Alcohol'],['Café De Sobremesa','Café espresso para acompañar el último bocado.',12,'Un Buen Final']],
 postres: [['Capricho De Chocolate','Chocolate intenso, textura suave y cacao.',28,'Selección Brasa 27'],['Flan De Vainilla','Flan cremoso con caramelo y vainilla.',24,'Un Clásico'],['Frutas A La Brasa','Frutas asadas con miel y helado de vainilla.',26,'Dulce Y Cálido'],['Tarta De Queso','Tarta suave con compota de frutos rojos.',30,'Para La Sobremesa']]
};
const toggle = document.querySelector('#nav-toggle');
const navigation = document.querySelector('#navigation');
function closeNavigation(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir Menú');toggle.textContent='☰';navigation.classList.remove('open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar Menú':'Abrir Menú');toggle.textContent=open?'×':'☰';navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeNavigation();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeNavigation();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeNavigation();});
window.matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeNavigation();});
const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
const panel=document.querySelector('#menu-panel');
function selectCategory(tab){tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});panel.setAttribute('aria-labelledby',tab.id);panel.replaceChildren(...MENU[tab.dataset.category].map(([name,description,price,tag])=>{const article=document.createElement('article');const title=document.createElement('h3');title.textContent=name;const amount=document.createElement('span');amount.textContent=`RD$ ${price}`;title.append(amount);const p=document.createElement('p');p.textContent=description;const small=document.createElement('small');small.textContent=tag;article.append(title,p,small);return article;}));}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectCategory(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();selectCategory(tabs[next]);}});});
selectCategory(tabs[0]);
function whatsappUrl(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
document.querySelectorAll('.whatsapp').forEach(link=>{link.href=whatsappUrl('Hola, Brasa 27. Me gustaría consultar disponibilidad para una reservación. (Plantilla de demostración)');link.target='_blank';link.rel='noopener noreferrer';});
const form=document.querySelector('#reservation-form');
const dateInput=document.querySelector('#date');
const timeInput=document.querySelector('#time');
const nameInput=document.querySelector('#name');
const status=document.querySelector('#form-status');
function localDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
dateInput.min=localDate(new Date());
form.addEventListener('input',()=>{dateInput.setCustomValidity('');timeInput.setCustomValidity('');nameInput.setCustomValidity('');status.textContent='';});
form.addEventListener('submit',e=>{e.preventDefault();const now=new Date();dateInput.min=localDate(now);const data=new FormData(form);const name=String(data.get('name')).trim();nameInput.setCustomValidity(name?'':'Escribe tu nombre.');const requested=new Date(`${data.get('date')}T${data.get('time')}:00`);timeInput.setCustomValidity(requested<=now?'Elige una fecha y hora futuras.':'');if(!form.reportValidity())return;const displayDate=requested.toLocaleDateString('es-BO',{day:'2-digit',month:'long',year:'numeric'});const message=['Hola, Brasa 27. Quisiera solicitar una reservación:','',`Nombre: ${name}`,`Cantidad De Personas: ${data.get('people')}`,`Fecha: ${displayDate}`,`Hora: ${data.get('time')}`,`Mensaje: ${String(data.get('message')).trim()||'Sin comentarios adicionales.'}`,'','Quedo pendiente de la confirmación de disponibilidad.','(Solicitud desde una plantilla de demostración)'].join('\n');status.textContent='Abriendo WhatsApp con los datos de tu solicitud…';window.location.assign(whatsappUrl(message));});
document.querySelector('#year').textContent=new Date().getFullYear();
