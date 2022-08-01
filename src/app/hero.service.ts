import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService,
				private http: HttpClient,
				) { }

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json'})
	};


// Old version with mock data
//   getHeroesOld(): Observable<Hero[]> {
// 	const heroes = of(HEROES);
// 	this.messageService.add('HeroService: fetched heroes');
// 	return heroes;
//   } 

// Old version with mock data
//   getHero(id: number): Observable<Hero> {
// 	const hero = HEROES.find(hero => hero.id === id)!;
// 	this.messageService.add(`HeroService: fetched hero id=${id}`);
// 	return of(hero);
//   }

//Get hero by id with in memory => Will 404 if id not found

getHero(id: number): Observable<Hero> {
	const url = `${this.heroesUrl}/${id}`;
	return this.http.get<Hero>(url).pipe(
		tap(_ => this.log(`fetched hero id=${id}`)),
		catchError(this.handleError<Hero>(`getHero id=${id}`))
	);
}

updateHero(hero: Hero): Observable<any> {
	return this.http.put(this.heroesUrl, hero, this.httpOptions)
	.pipe(
		tap(_ => this.log(`updated hero ${hero.id}`)),
		catchError(this.handleError<any>('updateHero'))
	);
}

  // Log a HeroService message with the MessageService
  private log(message: string) {
	this.messageService.add(`HeroService: ${message}`);
  }

  private heroesUrl = 'api/heroes'; // URL TO WEB API

	getHeroes(): Observable<Hero[]> {
	return this.http.get<Hero[]>(this.heroesUrl)
	.pipe(
		tap(_ => this.log('fetched heroes')),
		catchError(this.handleError<Hero[]>('getHeroes', []))
	);
	}

	//POST: add a new hero to the server

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
		.pipe(
			tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	//DELETE: delete hero from the server

	deleteHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, this.httpOptions)
		.pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	private handleError<T>(operation = 'operation', result?: T){
		return (error: any): Observable<T> => {
			//TODO: send the error to remote logging infras
			console.error(error); //log to console instead

			//TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			//Let the app keep running by returning an empty result.

			return of(result as T);
		}
	}

}


