const fs = require('fs');

let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

const exoneracionText = \`DECLARACIÓN DE EXONERACIÓN DE RESPONSABILIDAD
Y ACEPTACIÓN INFORMADA DE RIESGOS

Yo, mayor de edad, actuando en nombre propio y de manera libre, voluntaria e informada, manifiesto que deseo participar en actividades aéreas deportivas organizadas por el CLUB DEPORTIVO FUNDACIÓN FRATERNO, incluyendo entre otras el paracaidismo deportivo y experiencias de vuelo tipo “Piloto por un día”, identificado con NIT 901.334.881-4, en adelante EL CLUB.

PRIMERA – NATURALEZA DE LA ACTIVIDAD (ALTO RIESGO)
Declaro que conozco, entiendo y acepto que las actividades aéreas deportivas organizadas por el CLUB, incluyendo entre otras el paracaidismo deportivo y las experiencias de vuelo tipo “Piloto por un día”, son actividades de alto riesgo que involucran factores inherentes como caídas, impactos, fallas humanas, condiciones meteorológicas, operación de aeronaves, maniobras aéreas, uso de equipos especializados y variables externas no controlables, los cuales pueden generar lesiones graves, incapacidad permanente o incluso la muerte, aun cuando se apliquen protocolos de seguridad, normas técnicas y medidas preventivas.

SEGUNDA – ACEPTACIÓN INFORMADA DEL RIESGO
Manifiesto que asumo de manera consciente, expresa y voluntaria todos los riesgos inherentes, previsibles e imprevisibles derivados de mi participación en la actividad, incluso aquellos que puedan presentarse aun cuando EL CLUB, sus instructores, personal operativo o colaboradores actúen con diligencia y conforme a los estándares técnicos y normativos aplicables.

TERCERA – EXONERACIÓN DE RESPONSABILIDAD
En consecuencia, exonero, libero y mantengo indemne a EL CLUB, así como a sus directivos, comité ejecutivo, instructores, entrenadores, paracaidistas, personal operativo, empacadores, organizadores de eventos, contratistas, aliados estratégicos, propietarios de aeronaves y de los predios donde se desarrolla la actividad, operadores aeroportuarios y demás terceros vinculados directa o indirectamente a la operación, incluyendo entre otros, a la Federación Colombiana de Deportes Aéreos – FEDEAEREOS, el Instituto de Deportes y Recreación – INDER, la Aeronáutica Civil de Colombia y demás autoridades civiles, deportivas, aeronáuticas o administrativas de carácter local o nacional, frente a cualquier reclamación, demanda o acción de responsabilidad civil o extracontractual que se derive exclusivamente de los riesgos inherentes a la práctica del paracaidismo deportivo.
La presente exoneración no comprende eventos derivados de dolo o culpa grave, de conformidad con la ley.

CUARTA – CONDICIÓN FÍSICA Y DE SALUD
Declaro bajo la gravedad de juramento que me encuentro en condiciones físicas, mentales y emocionales aptas para la práctica del paracaidismo deportivo; que he informado de manera veraz, completa y oportuna cualquier condición médica relevante; y que asumo total responsabilidad por cualquier omisión, inexactitud o reticencia en la información suministrada.

QUINTA – CUMPLIMIENTO DE INSTRUCCIONES Y REGLAMENTOS
Me comprometo a acatar estrictamente todas las instrucciones, indicaciones y protocolos impartidos por los instructores, pilotos y por EL CLUB antes, durante y después de la actividad, reconociendo que el incumplimiento de dichas instrucciones incrementa significativamente los riesgos de la actividad.
Declaro que he sido informado(a) de la existencia de reglamentos y normas técnicas aplicables a las actividades aéreas deportivas organizadas por EL CLUB, incluyendo entre otras el paracaidismo deportivo y las experiencias de vuelo tipo “Piloto por un día”, y reconozco que es mi responsabilidad revisar y atender el material informativo y de seguridad suministrado por EL CLUB.
Reconozco igualmente que el incumplimiento, desatención o desobediencia de las instrucciones impartidas por los instructores, pilotos o personal operativo del CLUB puede generar situaciones de riesgo, y exonero al CLUB de cualquier responsabilidad derivada de lesiones, daños o incidentes que se produzcan como consecuencia de no acatar dichas instrucciones.

SEXTA – HEREDEROS Y BENEFICIARIOS
La presente aceptación informada del riesgo y exoneración de responsabilidad se extiende a mis herederos y beneficiarios, quienes no podrán formular reclamaciones contra EL CLUB por hechos derivados exclusivamente de los riesgos inherentes a la actividad aceptados mediante este documento.

SÉPTIMA – AUSENCIA DE RELACIÓN LABORAL O DE CONSUMO
Declaro que mi participación en la actividad no genera relación laboral, societaria ni contractual distinta a la propia de una actividad deportiva voluntaria, ni constituye una relación de consumo tradicional, ni implica obligación de resultado por parte de EL CLUB.

OCTAVA – USO DE IMAGEN Y MATERIAL AUDIOVISUAL
Autorizo de manera libre, expresa y gratuita a EL CLUB para captar, usar, reproducir y difundir mi imagen, voz y reacciones obtenidas durante la actividad, en medios institucionales, educativos, promocionales o publicitarios, sin límite temporal ni territorial, sin que ello genere contraprestación económica alguna.

NOVENA – ACEPTACIÓN DE TÉRMINOS Y CONDICIONES
Declaro que he leído, comprendido y aceptado íntegramente el presente documento, así como los Términos y Condiciones de EL CLUB, los cuales han sido puestos a mi disposición por distintos medios.

AUTORIZACIÓN DE DATOS PERSONALES (REFERENCIA)
Declaro que he otorgado autorización para el tratamiento de mis datos personales y el uso de mi imagen conforme a lo establecido en la Ficha de Información del Participante, la cual forma parte integral del presente proceso y he diligenciado de manera libre y voluntaria.

En constancia de lo anterior, firmo el presente documento en señal de aceptación libre, voluntaria e informada.\`;

const terminosText = \`TÉRMINOS Y CONDICIONES
FRATERNO PARACAIDISMO – CLUB DEPORTIVO DE ACTIVIDADES AÉREAS

FRATERNO PARACAIDISMO es un proyecto deportivo de la Fundación Fraterno, orientado a la práctica de deportes aéreos y al desarrollo de experiencias deportivas formativas y recreativas.

Las actividades de paracaidismo y, en general, los deportes aéreos que ofrece o pueda ofrecer en el futuro FRATERNO PARACAIDISMO, tales como parapente, paramotor, programas de acompañamiento en cabina, experiencias denominadas comercialmente “Piloto por un día” o “Experiencia Copiloto Fraterno”, u otros afines, constituyen actividades deportivas de alto riesgo, desarrolladas dentro del marco de una práctica voluntaria, formativa y recreativa, y se encuentran reguladas por las autoridades competentes en Colombia, entre ellas la Aeronáutica Civil, Inder y FEDEAEREOS.

La participación en cualquiera de estas actividades se realiza en calidad de alumno de un club deportivo, y no corresponde a la prestación de servicios turísticos ni de transporte aéreo comercial, sino a la práctica deportiva bajo estándares técnicos, operativos y de seguridad propios de los deportes aéreos.

La participación en las actividades ofrecidas por FRATERNO PARACAIDISMO requiere la aceptación previa, expresa, libre e informada de los presentes Términos y Condiciones, los cuales regulan el acceso, uso, contratación, pagos, reservas, cambios, cancelaciones, reembolsos, condiciones de salud, requisitos, documentación y demás aspectos relacionados con la práctica deportiva.

Naturaleza operativa de la actividad
Las actividades aéreas desarrolladas por FRATERNO PARACAIDISMO dependen de múltiples factores operativos, técnicos, meteorológicos y de seguridad que pueden afectar la programación, duración o ejecución de la actividad.
En consecuencia, el alumno reconoce y acepta que la seguridad operacional tendrá siempre prioridad sobre cualquier expectativa individual, por lo que los instructores, pilotos y personal autorizado podrán tomar decisiones operativas necesarias para garantizar la seguridad de la actividad.

1. OBJETO Y ACEPTACIÓN DE LOS TÉRMINOS
El presente documento tiene por objeto regular las condiciones bajo las cuales los alumnos participan en las actividades deportivas aéreas ofrecidas por FRATERNO PARACAIDISMO, incluyendo aspectos operativos, administrativos, técnicos y de seguridad.
La aceptación de estos Términos y Condiciones es obligatoria y constituye requisito esencial para la participación. En caso de no estar de acuerdo con su contenido, el interesado deberá abstenerse de realizar la reserva y de participar en la actividad.

8. CAMBIOS, CANCELACIONES Y DEVOLUCIONES
8.1 Cambios en la reserva
Las solicitudes de cambio deberán realizarse únicamente a través del WhatsApp oficial +57 302 338 1129, desde el mismo número registrado en la compra.
Los cambios estarán sujetos a los siguientes plazos y condiciones:
- Cambios solicitados con un mínimo de diez (10) días calendario de anticipación: Tendrán un costo de $220.000 COP por alumno.
- Cambios solicitados entre ocho (8) y diez (10) días calendario antes de la fecha programada: Tendrán un costo de $960.000 COP por alumno.
- Cambios solicitados con menos de tres (3) días calendario de anticipación: No serán aceptados, entendiéndose la reserva como desistimiento del servicio, sin derecho a reembolso.

8.2 Cancelaciones e inasistencias por parte del alumno
Si el alumno decide no realizar la actividad en la fecha programada, no habrá lugar a reembolso. La inasistencia, el no presentarse sin aviso previo, o los retrasos que impidan la ejecución de la actividad, se considerarán desistimiento del servicio y se perderá el valor total del cupo reservado.

8.3 Cancelaciones por parte de FRATERNO PARACAIDISMO
En casos de clima adverso, restricciones aéreas, fallas técnicas temporales, inspecciones, orden público u otras situaciones de fuerza mayor o caso fortuito que impidan la realización de la actividad, esta será reprogramada para una nueva fecha disponible, sin que ello implique devolución automática del dinero. Únicamente en caso de imposibilidad definitiva y objetiva de prestar la actividad, el alumno podrá solicitar el reembolso.

9. INASISTENCIAS, RETRASOS Y VARIABLES EXTERNAS
El alumno reconoce que las actividades aéreas dependen de múltiples factores fuera del control del club, entre ellos: Condiciones climáticas, Restricciones de autoridades aeronáuticas o de fuerza pública, Operación aeroportuaria, Disponibilidad de aeronaves, instructores y personal técnico.

10. HORARIOS, CONFIRMACIÓN Y REPROGRAMACIONES
La hora exacta de la actividad será confirmada el día anterior a la fecha programada, una vez se cuente con la aprobación de los planes de vuelo. No es posible garantizar una hora fija con mayor antelación.

13. EXCLUSIÓN Y LIMITACIÓN DE RESPONSABILIDAD
FRATERNO PARACAIDISMO será responsable únicamente dentro del marco legal aplicable y conforme a los estándares exigibles a la práctica de deportes aéreos en Colombia. No será responsable por: Retrasos, inasistencias o cancelaciones imputables al alumno. Pérdida, daño o extravío de objetos personales. Incumplimiento de los requisitos de edad, peso, estado de salud. Daños o lesiones derivados de los riesgos inherentes propios de la práctica de deportes aéreos.

DECLARACIÓN FINAL DEL ALUMNO
Al realizar el pago de la reserva y/o participar en la actividad, el alumno declara que ha leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones, reconoce la naturaleza de alto riesgo de la actividad y acepta los riesgos inherentes a la práctica de deportes aéreos, dentro del marco legal aplicable, sin que ello implique renuncia a derechos irrenunciables conforme a la ley colombiana, ni a las coberturas del seguro cuando aplique.\`;

// Ensure we don't inject multiple times
if (!code.includes('window.TerminosText = `')) {
    code = \`window.TerminosText = \`\${terminosText}\`;\nwindow.ExoneracionText = \`\${exoneracionText}\`;\n\` + code;
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log("Injected texts into b2c-form.js");
} else {
    console.log("Texts already injected.");
}
