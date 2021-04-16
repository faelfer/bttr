import React, { useState, useEffect } from "react";
import "./styles.css";
import { minToTimeFormat } from '../../../../utils/timeFormat';
import workingDays from "../../../../utils/workingDays";

export default function Time({ abiliity, currentDate, timeTotal }) {
  const [percentage, setPercentage] = useState("");
  const [lackText, setLackText] = useState("");
  const [suggestionText, setSuggestionText] = useState("");

  useEffect(() => {
    function datesMonth() {
        console.log(`Data Atual: ${currentDate}`);
        // console.log(`Hoje: ${currentDate.getDate()}/${((currentDate.getMonth())+1)}/${currentDate.getFullYear()}`);
        const currentYear = currentDate.getFullYear();
        // console.log(`Ano Atual: ${currentYear}`);
        const currentMouth = currentDate.getMonth();
        console.log(`Mês Atual: ${currentMouth}`);
        const currentDay = currentDate.getDate();
        // console.log(`Hoje: ${currentDay}`);
        const manipulatedDate = new Date(currentYear, (currentMouth + 1), 0);
        console.log(`Data Manipulada: ${manipulatedDate}`);
        const lastDayMonth = manipulatedDate.getDate();
        // console.log(`Último Dia do Mês ${lastDayMonth}`);

        return { currentYear, currentMouth, currentDay, lastDayMonth }
    }
    
      console.log("Component Card | useEffect | abiliity:", abiliity);
      console.log("Component Card | useEffect | currentDate:", currentDate);
      console.log("Component Card | useEffect | timeTotal:", timeTotal);

      async function calculateProgress(goalPerDay, goalDone) {
          const { currentYear, currentMouth, currentDay, lastDayMonth } = await datesMonth();
  
          const businessDays = workingDays(lastDayMonth, currentYear, currentMouth);
              console.log("businessDays: ", businessDays);
          let goalMonth = (businessDays * goalPerDay);
              console.log(`Meta de Minutos: ${goalMonth} | ${minToTimeFormat(goalMonth)}`);
          let goalRemaining = (goalMonth - goalDone);
          const businessDaysSoFar = workingDays(currentDay, currentYear, currentMouth);
              console.log("BusinessDaysSoFar: ", businessDaysSoFar);
          let daysRemaining = (businessDays - businessDaysSoFar) + 1;
              console.log(`Dias Restantes: ${daysRemaining}`);
          let idealSituation = (businessDaysSoFar * goalPerDay);
              // console.log(`Situação Ideal: ${idealSituation}`);
          let currentPercentage = (( goalDone * 100 ) / goalMonth);
              console.log(`Ideal percentage so far: ${parseInt((businessDaysSoFar * 100)/businessDays)}%`);
  
          return { goalMonth, idealSituation, currentPercentage, goalRemaining, daysRemaining };
      }

      async function renderItem() {
          const {goalMonth, idealSituation, currentPercentage, goalRemaining, daysRemaining} = await calculateProgress(abiliity.timeDaily, timeTotal);
          // console.log("renderItem: ", goalMonth, idealSituation, currentPercentage, goalRemaining, daysRemaining);
  
          if ( timeTotal >= goalMonth ){
              console.log("renderItem | if: Parabéns, você concluiu a meta estabelecida!");
  
              setPercentage(parseInt(currentPercentage) + "%"); 
              setLackText('Parabéns, objetivo concluido!');
              console.log("================================================================");
          }else if ( timeTotal === idealSituation ){
              console.log("renderItem | else if: Você está de acordo com a meta estabelecida.");
  
              setPercentage(parseInt(currentPercentage) + "%"); 
              setLackText('Progresso ideal alcançado');
              setSuggestionText(( (minToTimeFormat(goalRemaining)).toString() + ' para atingir o objetivo'));
              console.log("================================================================");
          }else if ( timeTotal > idealSituation ){
              console.log("renderItem | else if: Você ultrapassou a meta estabelecida.");
  
              setPercentage(parseInt(currentPercentage) + "%"); 
              setLackText(( (minToTimeFormat(timeTotal-idealSituation)).toString() + ' acima do ideal' ));
              setSuggestionText(( (minToTimeFormat(goalRemaining)).toString() + ' para atingir o objetivo'));
              console.log("================================================================");
          }else {
              console.warn("renderItem | else: Você está abaixo da meta estabelecida.");
  
              setPercentage(parseInt(currentPercentage) + "%"); 
              setLackText(( (minToTimeFormat(idealSituation-timeTotal)).toString() + ' para o progresso ideal' ));
              setSuggestionText(( (minToTimeFormat(goalRemaining / (daysRemaining === 0 ? 1 : daysRemaining))).toString() + ' é sugerido para hoje'));
              console.log("================================================================");
          }
      }
  
      renderItem();
  }, [abiliity, timeTotal, currentDate]);

    return (
      <div className="abstract" >
        <p className="abstract__name">
          {abiliity.name}
        </p>
        <div className="abstract__progress">
          <div style={{ 
              width: (parseInt(percentage) > 100 ? '100%' : percentage), 
              height: 30, 
              borderRadius: 5,
              backgroundColor: '#309af4',
              textAlign: 'center',
              lineHeight: 1.9,
              fontWeight: 'bold',
              color: '#ffffff'
            }}
          >
            {`${parseInt(percentage)}%`}
          </div>
        </div>
        <p className="time__abiliity">
          {lackText}
        </p>
        {suggestionText ? 
          <p className="time__abiliity">
            {suggestionText}
          </p>
        :
          null
        }
      </div>
    )
};