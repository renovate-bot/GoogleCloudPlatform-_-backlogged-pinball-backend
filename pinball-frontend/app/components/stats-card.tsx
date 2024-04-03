'use client'

import { useEffect, useState } from "react";
import { completedGamesRef, recentGamesQuery } from "../firebase";
import { average, getAggregateFromServer, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Avatar from "@/app/components/avatar";

const returnInput = (value: number) => value;

type Game = {
  gameId: string,
  avatar: string,
  playerName: string,
  value: string,
}

const defaultGames = [{
  gameId: '',
  avatar: 'beaver',
  playerName: 'Loading...',
  value: 'Loading...',
}];

const now = new Date();
const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)); 

const utcTimestamp = Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 
       yesterday.getUTCHours(), yesterday.getUTCMinutes(), yesterday.getUTCSeconds(), yesterday.getUTCMilliseconds());

export default function StatsCard({ title, field, units, mapper = returnInput }: { title: string, field: string, units: string, mapper?: Function }) {
  const [topTen, setTopTen] = useState<Game[]>(defaultGames);
  const topGame = topTen[0];
  const [averageValue, setAverageValue] = useState<string>('Loading...');
  useEffect(() => {
    const maxValueQuery = query(completedGamesRef, orderBy(field, 'desc'), where('utcTimestamp', '>', utcTimestamp), limit(10))
    const unsubscribe = onSnapshot(maxValueQuery, (querySnapshot) => {
      const topTen = querySnapshot.docs.map(gameStats => {
        const data = gameStats.data();
        return {
          gameId: data.GameId,
          avatar: data.Avatar,
          playerName: data.PlayerName,
          value: mapper(data[field]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }
      });
      setTopTen(topTen);
    });
    return unsubscribe;
  }, [field, mapper]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(recentGamesQuery), async () => {
      const averageValueQueryResponse = await getAggregateFromServer(query(recentGamesQuery), { averageAverageValue: average(field) });
      const { averageAverageValue } = averageValueQueryResponse.data();
      if (averageAverageValue) {
        setAverageValue(Math.floor(mapper(averageAverageValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="m-2">
      <div className="flex justify-center border rounded overflow-hidden shadow-lg mx-auto w-full">
        <div className="px-6 py-4 text-center">
          <div className="mb-2 font-bold">Max<br />{title}</div>
          <div className="font-bold text-4xl">
            <center>
              <Avatar avatar={topGame.avatar} />
              <div className="text-lg">
                {topGame.playerName}
              </div>
              {topGame.value}
            </center>
          </div>
          <div className="mb-2 -mt-2">{units}</div>
          <hr className="m-8" />
          <div className="mb-2 font-bold">Average<br />{title}</div>
          <div className="font-bold text-4xl">
            {averageValue}
          </div>
          <div className="mb-2 -mt-2">{units}</div>
          <hr className="m-8" />
          <div className="mb-2 font-bold">Top 10</div>
          {topTen.map((game => (<div key={game.gameId}>
            <hr className="m-2" />
            <div className="flex justify-between">
              <Avatar avatar={game.avatar} />
              <div className="text-right">
                <div>{game.playerName}</div>
                <div>{game.value}</div>
              </div>
            </div>
          </div>)))}
        </div>
      </div>
    </div>
  );
}
