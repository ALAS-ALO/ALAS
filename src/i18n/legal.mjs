// Legal pages (aviso legal, privacy, cookies) in ES / EN / GL.
// The owner's details come from site.json, so the bracketed placeholders are filled in one place.
import SITE from './site.json';

const S = SITE;
const mail = (m) => (m.includes('@') ? `<a href="mailto:${m}">${m}</a>` : m);

export const LEGAL = {
  es: {
    ui: { back: 'Volver a la web', updated: 'Última actualización', nav: 'Información legal', notice: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies', team: 'Equipo descentralizado' },
    notice: {
      title: 'Aviso legal',
      intro: 'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular de este sitio web.',
      sections: [
        ['Titular', `<dl>
          <div><dt>Titular</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>Nombre comercial</dt><dd>ALAS (ALAS Studio y ALAS Space)</dd></div>
          <div><dt>NIF</dt><dd>${S.NIF}</dd></div>
          <div><dt>Domicilio</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Correo electrónico</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['Datos profesionales', `<p>La arquitectura es una profesión regulada. Datos del profesional responsable:</p><dl>
          <div><dt>Título</dt><dd>Arquitecto, expedido en ${S.TITULO_PAIS}</dd></div>
          <div><dt>Colegio profesional</dt><dd>${S.COLEGIO}</dd></div>
          <div><dt>Número de colegiado</dt><dd>${S.COLEGIADO}</dd></div></dl>
          <p>Normas profesionales aplicables: Ley 38/1999, de Ordenación de la Edificación, los estatutos del colegio profesional y el Código Deontológico de los Arquitectos, que pueden consultarse en la web del Consejo Superior de los Colegios de Arquitectos de España (cscae.com) y en la del colegio correspondiente.</p>`],
        ['Objeto del sitio', '<p>Este sitio informa sobre los servicios de arquitectura de ALAS Studio y de consultoría tecnológica de ALAS Space, y permite ponerse en contacto con el titular.</p>'],
        ['Propiedad intelectual e industrial', '<p>Los textos, diagramas, animaciones, diseño gráfico y logotipos de ALAS pertenecen al titular. No se permite reproducirlos, distribuirlos ni transformarlos sin autorización por escrito.</p><p>Los logotipos de otras empresas pertenecen a sus titulares y solo se muestran para identificar a empresas con las que hemos trabajado. Los vídeos de las fichas de servicios proceden de bancos de imágenes con licencia de uso.</p>'],
        ['Responsabilidad', '<p>La información de este sitio es orientativa y no constituye una oferta vinculante. Los ejemplos, simulaciones, tiempos y cifras de los diagramas son ilustrativos. El alcance, el plazo y los honorarios de cada encargo se fijan siempre en una propuesta por escrito.</p><p>El titular no responde de los contenidos de sitios externos a los que se pueda enlazar desde esta web.</p>'],
        ['Legislación aplicable', '<p>Este aviso se rige por la legislación española. Si eres consumidor, serán competentes los juzgados de tu domicilio.</p>'],
      ],
    },
    privacy: {
      title: 'Política de privacidad',
      intro: 'Te explicamos qué datos personales tratamos cuando nos escribes a través de esta web, para qué los usamos y qué derechos tienes, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).',
      sections: [
        ['Responsable', `<dl>
          <div><dt>Responsable</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>NIF</dt><dd>${S.NIF}</dd></div>
          <div><dt>Domicilio</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Contacto</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['Qué datos tratamos', '<p>Solo los que nos das en el formulario de contacto: la rama que te interesa, el tipo de cliente, tu nombre, tu correo, tu teléfono si lo indicas y el mensaje. Guardamos también el idioma de la página y la fecha del envío. No usamos herramientas de analítica ni recogemos datos de navegación.</p>'],
        ['Para qué los usamos', '<p>Para responder a tu solicitud, preparar una propuesta si nos la pides y gestionar la relación con nuestros clientes. No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.</p>'],
        ['Base legal', '<p>La aplicación de medidas precontractuales a petición tuya (art. 6.1.b del RGPD). Si llegamos a trabajar juntos, la ejecución del contrato (art. 6.1.b) y el cumplimiento de obligaciones legales, como las fiscales (art. 6.1.c).</p>'],
        ['Cuánto tiempo los conservamos', '<p>Mientras atendemos tu solicitud. Si no llegamos a colaborar, los suprimimos como máximo doce meses después del último contacto. Si hay encargo, los conservamos durante la relación y, después, durante los plazos que exigen la normativa fiscal y la de responsabilidad profesional.</p>'],
        ['Quién más accede a ellos', '<p>No cedemos tus datos a terceros, salvo obligación legal. Para prestar el servicio usamos dos proveedores que actúan como encargados del tratamiento: Cloudflare, Inc. (alojamiento de la web y envío del formulario) y Notion Labs, Inc. (herramienta de gestión de clientes).</p>'],
        ['Transferencias internacionales', '<p>Ambos proveedores tienen sede en Estados Unidos. Las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o, en su defecto, en las cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>'],
        ['Tus derechos', `<p>Puedes pedir el acceso, la rectificación o la supresión de tus datos, oponerte a su tratamiento, solicitar su limitación o su portabilidad escribiendo a ${mail(S.CORREO)}. Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>`],
        ['Seguridad', '<p>La web funciona con conexión cifrada (HTTPS) y el acceso a los datos está limitado a quien los necesita para atender tu solicitud.</p>'],
      ],
    },
    cookies: {
      title: 'Política de cookies',
      intro: 'Esta web no usa cookies propias ni de terceros. No tiene analítica, publicidad ni botones de redes sociales, y las tipografías y los vídeos se sirven desde el propio sitio.',
      sections: [
        ['Almacenamiento local', '<p>La web guarda en tu navegador un único dato técnico, <code>alas-visited</code>, para no repetir la animación de entrada en tus siguientes visitas. No te identifica, no se envía a ningún servidor y puedes borrarlo cuando quieras desde la configuración de tu navegador.</p>'],
        ['Cookies de seguridad del alojamiento', '<p>Nuestro proveedor de alojamiento, Cloudflare, puede instalar cookies técnicas de seguridad (como <code>__cf_bm</code>) para proteger la web frente a tráfico automatizado. Son necesarias para el funcionamiento del sitio y no se usan para seguimiento ni publicidad.</p>'],
        ['Cómo gestionarlas', '<p>Puedes ver y eliminar las cookies y los datos guardados por cualquier web desde las opciones de privacidad de tu navegador.</p>'],
        ['Cambios', '<p>Si en el futuro incorporamos cookies que necesiten tu consentimiento, te lo pediremos antes de usarlas y actualizaremos esta política.</p>'],
      ],
    },
  },

  en: {
    ui: { back: 'Back to the website', updated: 'Last updated', nav: 'Legal information', notice: 'Legal notice', privacy: 'Privacy', cookies: 'Cookies', team: 'Distributed team' },
    notice: {
      title: 'Legal notice',
      intro: 'In compliance with article 10 of Spanish Law 34/2002 of 11 July on information society services and electronic commerce (LSSI-CE), these are the details of the owner of this website.',
      sections: [
        ['Owner', `<dl>
          <div><dt>Owner</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>Trade name</dt><dd>ALAS (ALAS Studio and ALAS Space)</dd></div>
          <div><dt>Tax ID (NIF)</dt><dd>${S.NIF}</dd></div>
          <div><dt>Address</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Email</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['Professional details', `<p>Architecture is a regulated profession in Spain. Details of the professional in charge:</p><dl>
          <div><dt>Qualification</dt><dd>Architect, awarded in ${S.TITULO_PAIS}</dd></div>
          <div><dt>Professional association</dt><dd>${S.COLEGIO}</dd></div>
          <div><dt>Membership number</dt><dd>${S.COLEGIADO}</dd></div></dl>
          <p>Applicable professional rules: Spanish Law 38/1999 on Building Regulation, the statutes of the professional association and the Code of Ethics for Architects, available on the website of the Spanish Council of Architects' Associations (cscae.com) and on that of the relevant association.</p>`],
        ['Purpose of the site', '<p>This site describes the architecture services of ALAS Studio and the technology consultancy services of ALAS Space, and lets you get in touch with the owner.</p>'],
        ['Intellectual and industrial property', '<p>The texts, diagrams, animations, graphic design and logos of ALAS belong to the owner. They may not be reproduced, distributed or transformed without written permission.</p><p>Other companies\' logos belong to their owners and are shown only to identify companies we have worked with. The videos on the service cards come from stock libraries under a licence of use.</p>'],
        ['Liability', '<p>The information on this site is for guidance only and is not a binding offer. The examples, simulations, times and figures in the diagrams are illustrative. The scope, timeline and fees of each commission are always set out in a written proposal.</p><p>The owner is not responsible for the content of external sites linked from this website.</p>'],
        ['Governing law', '<p>This notice is governed by Spanish law. If you are a consumer, the courts of your place of residence will have jurisdiction.</p>'],
      ],
    },
    privacy: {
      title: 'Privacy policy',
      intro: 'This page explains what personal data we process when you write to us through this website, what we use it for and what your rights are, under Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 (LOPDGDD).',
      sections: [
        ['Controller', `<dl>
          <div><dt>Controller</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>Tax ID (NIF)</dt><dd>${S.NIF}</dd></div>
          <div><dt>Address</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Contact</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['What data we process', '<p>Only what you give us in the contact form: the branch you are interested in, the type of client, your name, your email, your phone number if you provide it and your message. We also store the language of the page and the date it was sent. We do not use analytics tools or collect browsing data.</p>'],
        ['What we use it for', '<p>To answer your request, prepare a proposal if you ask for one and manage our relationship with clients. We do not make automated decisions or build profiles with your data.</p>'],
        ['Legal basis', '<p>Steps taken at your request before entering into a contract (art. 6.1.b GDPR). If we end up working together, performance of the contract (art. 6.1.b) and compliance with legal obligations such as tax obligations (art. 6.1.c).</p>'],
        ['How long we keep it', '<p>While we deal with your request. If we do not end up working together, we delete it no later than twelve months after the last contact. If there is a commission, we keep it for the duration of the relationship and then for the periods required by tax and professional liability rules.</p>'],
        ['Who else has access', '<p>We do not share your data with third parties unless required by law. To provide the service we use two providers acting as processors: Cloudflare, Inc. (website hosting and form delivery) and Notion Labs, Inc. (client management tool).</p>'],
        ['International transfers', '<p>Both providers are based in the United States. Transfers are covered by the EU-US Data Privacy Framework or, failing that, by the standard contractual clauses approved by the European Commission.</p>'],
        ['Your rights', `<p>You can request access to, rectification or erasure of your data, object to its processing, or request its restriction or portability by writing to ${mail(S.CORREO)}. If you believe we have not handled your request properly, you can lodge a complaint with the Spanish Data Protection Agency (aepd.es).</p>`],
        ['Security', '<p>The website uses an encrypted connection (HTTPS), and access to the data is limited to those who need it to deal with your request.</p>'],
      ],
    },
    cookies: {
      title: 'Cookie policy',
      intro: 'This website does not use its own or third-party cookies. It has no analytics, advertising or social media buttons, and the fonts and videos are served from the site itself.',
      sections: [
        ['Local storage', '<p>The website stores a single technical item in your browser, <code>alas-visited</code>, so the opening animation is not repeated on your next visits. It does not identify you, is not sent to any server and you can delete it at any time from your browser settings.</p>'],
        ['Hosting security cookies', '<p>Our hosting provider, Cloudflare, may set technical security cookies (such as <code>__cf_bm</code>) to protect the website from automated traffic. They are necessary for the site to work and are not used for tracking or advertising.</p>'],
        ['How to manage them', '<p>You can view and delete the cookies and data stored by any website from your browser\'s privacy settings.</p>'],
        ['Changes', '<p>If we ever add cookies that require your consent, we will ask for it before using them and update this policy.</p>'],
      ],
    },
  },

  gl: {
    ui: { back: 'Volver á web', updated: 'Última actualización', nav: 'Información legal', notice: 'Aviso legal', privacy: 'Privacidade', cookies: 'Cookies', team: 'Equipo descentralizado' },
    notice: {
      title: 'Aviso legal',
      intro: 'En cumprimento do artigo 10 da Lei 34/2002, do 11 de xullo, de servizos da sociedade da información e de comercio electrónico (LSSI-CE), estes son os datos do titular deste sitio web.',
      sections: [
        ['Titular', `<dl>
          <div><dt>Titular</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>Nome comercial</dt><dd>ALAS (ALAS Studio e ALAS Space)</dd></div>
          <div><dt>NIF</dt><dd>${S.NIF}</dd></div>
          <div><dt>Domicilio</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Correo electrónico</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['Datos profesionais', `<p>A arquitectura é unha profesión regulada. Datos do profesional responsable:</p><dl>
          <div><dt>Título</dt><dd>Arquitecto, expedido en ${S.TITULO_PAIS}</dd></div>
          <div><dt>Colexio profesional</dt><dd>${S.COLEGIO}</dd></div>
          <div><dt>Número de colexiado</dt><dd>${S.COLEGIADO}</dd></div></dl>
          <p>Normas profesionais aplicables: Lei 38/1999, de Ordenación da Edificación, os estatutos do colexio profesional e o Código Deontolóxico dos Arquitectos, que se poden consultar na web do Consello Superior dos Colexios de Arquitectos de España (cscae.com) e na do colexio correspondente.</p>`],
        ['Obxecto do sitio', '<p>Este sitio informa sobre os servizos de arquitectura de ALAS Studio e de consultoría tecnolóxica de ALAS Space, e permite poñerse en contacto co titular.</p>'],
        ['Propiedade intelectual e industrial', '<p>Os textos, diagramas, animacións, deseño gráfico e logotipos de ALAS pertencen ao titular. Non se permite reproducilos, distribuílos nin transformalos sen autorización por escrito.</p><p>Os logotipos doutras empresas pertencen aos seus titulares e só se amosan para identificar empresas coas que traballamos. Os vídeos das fichas de servizos proceden de bancos de imaxes con licenza de uso.</p>'],
        ['Responsabilidade', '<p>A información deste sitio é orientativa e non constitúe unha oferta vinculante. Os exemplos, simulacións, tempos e cifras dos diagramas son ilustrativos. O alcance, o prazo e os honorarios de cada encargo fíxanse sempre nunha proposta por escrito.</p><p>O titular non responde dos contidos de sitios externos aos que se poida ligar desde esta web.</p>'],
        ['Lexislación aplicable', '<p>Este aviso réxese pola lexislación española. Se es consumidor, serán competentes os xulgados do teu domicilio.</p>'],
      ],
    },
    privacy: {
      title: 'Política de privacidade',
      intro: 'Explicámosche que datos persoais tratamos cando nos escribes a través desta web, para que os usamos e que dereitos tes, de acordo co Regulamento (UE) 2016/679 (RXPD) e a Lei Orgánica 3/2018 (LOPDGDD).',
      sections: [
        ['Responsable', `<dl>
          <div><dt>Responsable</dt><dd>${S.TITULAR}</dd></div>
          <div><dt>NIF</dt><dd>${S.NIF}</dd></div>
          <div><dt>Domicilio</dt><dd>${S.DOMICILIO}</dd></div>
          <div><dt>Contacto</dt><dd>${mail(S.CORREO)}</dd></div></dl>`],
        ['Que datos tratamos', '<p>Só os que nos dás no formulario de contacto: a rama que che interesa, o tipo de cliente, o teu nome, o teu correo, o teu teléfono se o indicas e a mensaxe. Gardamos tamén o idioma da páxina e a data do envío. Non usamos ferramentas de analítica nin recollemos datos de navegación.</p>'],
        ['Para que os usamos', '<p>Para responder á túa solicitude, preparar unha proposta se nola pides e xestionar a relación cos nosos clientes. Non tomamos decisións automatizadas nin elaboramos perfís cos teus datos.</p>'],
        ['Base legal', '<p>A aplicación de medidas precontractuais por petición túa (art. 6.1.b do RXPD). Se chegamos a traballar xuntos, a execución do contrato (art. 6.1.b) e o cumprimento de obrigas legais, como as fiscais (art. 6.1.c).</p>'],
        ['Canto tempo os conservamos', '<p>Mentres atendemos a túa solicitude. Se non chegamos a colaborar, suprimímolos como máximo doce meses despois do último contacto. Se hai encargo, conservámolos durante a relación e, despois, durante os prazos que esixen a normativa fiscal e a de responsabilidade profesional.</p>'],
        ['Quen máis accede a eles', '<p>Non cedemos os teus datos a terceiros, salvo obriga legal. Para prestar o servizo usamos dous provedores que actúan como encargados do tratamento: Cloudflare, Inc. (aloxamento da web e envío do formulario) e Notion Labs, Inc. (ferramenta de xestión de clientes).</p>'],
        ['Transferencias internacionais', '<p>Ambos provedores teñen sede nos Estados Unidos. As transferencias ampáranse no Marco de Privacidade de Datos UE-EE. UU. ou, no seu defecto, nas cláusulas contractuais tipo aprobadas pola Comisión Europea.</p>'],
        ['Os teus dereitos', `<p>Podes pedir o acceso, a rectificación ou a supresión dos teus datos, opoñerte ao seu tratamento, ou solicitar a súa limitación ou a súa portabilidade escribindo a ${mail(S.CORREO)}. Se consideras que non atendemos ben a túa solicitude, podes reclamar ante a Axencia Española de Protección de Datos (aepd.es).</p>`],
        ['Seguridade', '<p>A web funciona con conexión cifrada (HTTPS) e o acceso aos datos está limitado a quen os precisa para atender a túa solicitude.</p>'],
      ],
    },
    cookies: {
      title: 'Política de cookies',
      intro: 'Esta web non usa cookies propias nin de terceiros. Non ten analítica, publicidade nin botóns de redes sociais, e as tipografías e os vídeos sérvense desde o propio sitio.',
      sections: [
        ['Almacenamento local', '<p>A web garda no teu navegador un único dato técnico, <code>alas-visited</code>, para non repetir a animación de entrada nas túas seguintes visitas. Non te identifica, non se envía a ningún servidor e podes borralo cando queiras desde a configuración do teu navegador.</p>'],
        ['Cookies de seguridade do aloxamento', '<p>O noso provedor de aloxamento, Cloudflare, pode instalar cookies técnicas de seguridade (como <code>__cf_bm</code>) para protexer a web fronte a tráfico automatizado. Son necesarias para o funcionamento do sitio e non se usan para seguimento nin publicidade.</p>'],
        ['Como xestionalas', '<p>Podes ver e eliminar as cookies e os datos gardados por calquera web desde as opcións de privacidade do teu navegador.</p>'],
        ['Cambios', '<p>Se no futuro incorporamos cookies que precisen o teu consentimento, pedirémolo antes de usalas e actualizaremos esta política.</p>'],
      ],
    },
  },
};
