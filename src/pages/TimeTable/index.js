import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";
import api from "../../services/api";
import { getToken, logout } from "../../services/auth";
import { formatDateCalendar } from "../../utils/timeFormat";
import NavBar from "../../components/NavBar";
import Time from "./components/Time";
import Abstract from "./components/Abstract";
import Load from "../../components/Load";
import { useParams } from "react-router-dom";

export default function TimeTable({ history }) {
    const token = getToken(); 
    const { abiliityId } = useParams();
    const [times, setTimes] = useState([]);
    const [timeInfo, setTimeInfo] = useState({});
    const [page, setPage] = useState(1);
    const [abiliity, setAbiliity] = useState({});
    const [timeTotal, setTimeTotal] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    const [dateFilter, setDateFilter] = useState("any date");
    const [currentDate, setCurrentDate] = useState(new Date())
    const [error, setError] = useState('');

    const getTimesFilterByAbiliity = useCallback(async (pageNumber = 1) => {
      setIsLoad(true);
        try {
          const response = await api.get(`/time/filter_by_abiliity/${abiliityId}?page=${pageNumber}`, {
              headers: { "Authorization": token }
          });
          console.log("getTimesFilterByAbiliity | response: ", response);
          const { docs, ...timeInfo } = response.data;
          setIsLoad(false);
          if(!response.data.status === 200) {
              setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          }

          setError("")
          setTimes(docs)
          setTimeInfo(timeInfo);
          setPage(pageNumber);
        } catch (error) {
          console.log("getTimesFilterByAbiliity | error: ", error);
            if(error.message === "Request failed with status code 401") {
              logout();
              history.push("/");
            }
          setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          setIsLoad(false);
        }

    }, [token, history, abiliityId]);

    const getTimes = useCallback(async (pageNumber = 1) => {
      setIsLoad(true);
        try {
          const response = await api.get(`/time?page=${pageNumber}`, {
              headers: { "Authorization": token }
          });
          console.log("getTimes | response: ", response);
          const { docs, ...timeInfo } = response.data;
          setIsLoad(false);
          if(!response.data.status === 200) {
              setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          }

          setTimes(docs)
          setTimeInfo(timeInfo);
          setPage(pageNumber);
        } catch (error) {
          console.log("getTimes | error: ", error);
            if(error.message === "Request failed with status code 401") {
              logout();
              history.push("/");
            }
          setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          setIsLoad(false);
        }

    }, [token, history]);

    const getTimesFilterByDate = useCallback(async () => {
      setIsLoad(true);
        try {
          console.log("getTimesFilterByDate | currentDate: ", currentDate);
          const response = await api.get(`/time/filter_by_abiliity_and_date/${abiliityId}?date=${formatDateCalendar(currentDate)}`, {
              headers: { "Authorization": token }
          });
          console.log("getTimesFilterByDate | response: ", response);
          setIsLoad(false);

          if(!response.data.status === 200) {
              setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          }

            console.log("getTimesFilterByDate | (response.data).length: ", (response.data).length);
            if ((response.data).length !== 0) {
              setError("");
              setTimes(response.data)
              setAbiliity(response.data[0].abiliity)
              console.log("getTimesFilterByDate | if (response.data[0] > 1) ");
              let minutesTotal = (response.data).reduce(function(acumulador, valorAtual, index, array) {
                console.log("(response.data).reduce | valorAtual: ", valorAtual)
                console.log("(response.data).reduce | acumulador: ", acumulador)
                console.log("(response.data).reduce | acumulador.minutes: ", acumulador.minutes)
                console.log("(response.data).reduce | valorAtual.minutes: ", valorAtual.minutes)
                console.log("(response.data).reduce | typeof acumulador: ", typeof acumulador)
                console.log("============================================================")

                if (typeof acumulador ===	"object") {
                  return acumulador.minutes + valorAtual.minutes;
                } else {
                  return acumulador + valorAtual.minutes;
                }

              });
              console.log("getTimesFilterByDate | minutesTotal: ", minutesTotal);
              setTimeTotal(typeof minutesTotal ===	"object" ? minutesTotal.minutes : minutesTotal)
            } else {
              console.log("getTimesFilterByDate | else");
              setError("Não existem registros de tempo suficientes para calcular a métrica mensal");

            }
        } catch (error) {
          console.log("getTimesFilterByDate | error: ", error);
            if(error.message === "Request failed with status code 401") {
              logout();
              history.push("/");
            }
          setError("Houve um problema ao listar seus registros de tempo, tente novamente mais tarde");
          setIsLoad(false);
        }

    }, [token, history, abiliityId, currentDate]);

    useEffect(() => {

      if(!abiliityId) {
        getTimes();
      } else {
        getTimesFilterByAbiliity();
      }

    }, [token, history, abiliityId, getTimes, getTimesFilterByAbiliity]);

    useEffect(() => {
      switch (dateFilter) {
        case 'month':
          getTimesFilterByDate()
          break;
        default:
          if(!abiliityId) {
            getTimes();
          } else {
            getTimesFilterByAbiliity();
          }
      }

    }, [abiliityId, dateFilter, currentDate, getTimes, getTimesFilterByAbiliity, getTimesFilterByDate]);

    function prevPage() {
      if (page === 1) return;

      const pageNumber = page - 1;

      switch (dateFilter) {
        case 'month':
          getTimesFilterByDate(pageNumber)
          break;
        default:
          if(!abiliityId) {
            getTimes(pageNumber);
          } else {
            getTimesFilterByAbiliity(pageNumber);
          }
      }
      
  }

  function nextPage() {
      console.log("nextPage");
      if (page === timeInfo.pages) return;

      const pageNumber = page + 1;
      console.log("nextPage | pageNumber: ", pageNumber);
      switch (dateFilter) {
        case 'month':
          getTimesFilterByDate(pageNumber)
          break;
        default:
          if(!abiliityId) {
            getTimes(pageNumber);
          } else {
            getTimesFilterByAbiliity(pageNumber);
          }
      }
      
  }

    return (
        <>
            <NavBar navigation={history}/>
            <Load isShow={isLoad}/>
            <div className="content--align content--column">
              <div className="time__content">
                <>
                    <div className="time__create">
                      <button className="time__button" onClick={() => history.push("/time")}>
                        Criar registro de tempo
                      </button>  
                    </div>
                </>
              </div>

              {abiliityId && times.length !== 0 ?
                (
                  <div className="time__content">
                    <select 
                      className="time__filter" 
                      value={dateFilter} 
                      onChange={event => {
                        console.log("select | event.target.value: ",event.target.value)
                        setDateFilter(event.target.value) 
                      }}
                    >
                      <option value="month">Métrica mensal</option>
                      <option value="any date">Lista de registros</option>
                    </select>
                  </div>
                )
              :
                null
              }
              
              {dateFilter === "month" ?
                <>
                  <div className="time__content">
                    <input 
                      type="date"
                      className="time__filter" 
                      value={formatDateCalendar(currentDate)} 
                      onChange={event => {
                        console.log("input date | event.target.value: ",event.target.value)
                        setCurrentDate(new Date(event.target.value)) 
                      }}
                    />
                  </div>
                  <div className="time__content">
                  {error && <p className="form__message--error">{error}</p>}
                  {error ?
                    null
                  :
                    <Abstract 
                      abiliity={abiliity} 
                      currentDate={currentDate} 
                      timeTotal={timeTotal}
                    />
                  }
                  </div>
                </>
              :
                <>
                  <div className="time__content">
                    {error && <p className="form__message--error">{error}</p>}
                    <>
                      {times.map((time, key) => (
                        <Time time={time} history={history} key={key}/>
                      ))}
                    </>
                  </div>

                  <div className="time__content">
                    <>
                        <div className="home__pagination">
                          <button className="pagination__button" disabled={page === 1} onClick={prevPage}>
                            Anterior
                          </button>
                          <button className="pagination__button" disabled={page === timeInfo.pages} onClick={nextPage}>
                            Próximo
                          </button>
                        </div>
                    </>
                  </div>
                </>
              }
            </div>
        </>
    )
};