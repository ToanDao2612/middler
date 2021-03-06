import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointRule } from './models/endpoint-rule';
import { CreateMiddlerRuleDto } from './models/create-endpoint-rule';
import { of, BehaviorSubject } from 'rxjs';
import { tap, shareReplay, take } from 'rxjs/operators';
import { MessageService } from '@services';
import { compare } from 'fast-json-patch';
import { DoobEditorFile } from '@doob-ng/editor';
//import { DoobEditorFile } from '@doob-ng/editor';

const patchHeaders = new HttpHeaders({
    'Content-Type': 'application/json-patch+json',
    'Accept': 'application/json'
})

@Injectable({
    providedIn: 'root'
})
export class EndpointRulesService {


    private _middlerRules: Array<EndpointRule>;
    set MiddlerRules(value: Array<EndpointRule>) {
        this._middlerRules = (value || []).sort(this.SortRules);
        this.MiddlerRulesSubject$.next(this._middlerRules);
    }
    get MiddlerRules() {
        return this._middlerRules
    }

    private MiddlerRulesSubject$ = new BehaviorSubject<Array<EndpointRule>>(null);
    public MiddlerRules$ = this.MiddlerRulesSubject$.asObservable().pipe(shareReplay());

    private RulesOrder: {
        [key: string]: number
    } = {}

    constructor(private http: HttpClient, private message: MessageService) {

        this.message.RunOnEveryReconnect(() => this.GetAll().subscribe());
        this.message.RunOnEveryReconnect(() => this.GetTypings());

        this.message.Stream<any>("MiddlerRule.Subscribe").pipe(
            tap(item => console.log(item))
        ).subscribe()
    }

    public GetAll() {

        return this.message
            .Invoke<Array<EndpointRule>>("MiddlerRule.GetAll")
            .pipe(
                tap(rules => {
                    rules.forEach(r => this.RulesOrder[r.Id] = r.Order)
                    this.MiddlerRules = rules;
                })
            );
    }

    public Get(id: string) {
        const rule = this.MiddlerRules?.find(r => r.Id === id);
        if (rule) {
            return of(rule)
        } else {
            return this.message.Invoke<EndpointRule>("MiddlerRule.Get", id)
        }
    }

    public Add(rule: CreateMiddlerRuleDto) {
        return this.http.post(`/api/repo/litedb`, rule).pipe(
            tap(res => this.GetAll().subscribe())
        );
    }

    public Remove(id: string) {
        return this.http.delete(`/api/repo/litedb/${id}`).pipe(
            tap(res => this.GetAll().subscribe())
        );
    }

    public UpdatePartial(id: string, patchDocument: any) {

        const patchHeaders = new HttpHeaders({
            'Content-Type': 'application/json-patch+json',
            'Accept': 'application/json'
        })

        return this.http.patch<EndpointRule>(`/api/repo/litedb/${id}`, patchDocument, { headers: patchHeaders })
            .pipe(tap(rule => this.UpdatedMiddlerRule(rule)));

    }

    private AddedMiddlerRule(value: EndpointRule) {
        this.MiddlerRules = [...this.MiddlerRules, value];
    }

    private UpdatedMiddlerRule(value: EndpointRule) {
        this.MiddlerRules = this.MiddlerRules.map(rule => {
            if (rule.Id == value.Id) {
                return value;
            } else {
                return rule;
            }
        });
    }

    private DeletedRule(value: EndpointRule | string) {
        let id: string;
        if (value instanceof EndpointRule) {
            id = value.Id;
        } else {
            id = value;
        }

        this.MiddlerRules = this.MiddlerRules.filter(rule => rule.Id == id);
    }

    private SortRules(a: EndpointRule, b: EndpointRule) {
        if (a.Order > b.Order) {
            return 1;
        } else if (a.Order < b.Order) {
            return -1;
        }
        return 0;
    }

    public GetNextLastOrder() {
        if (!this.MiddlerRules || this.MiddlerRules.length === 0) {
            return 10;
        }
        return Math.trunc(Math.max(...this.MiddlerRules.map(r => r.Order)) + 10);
    }

    public UpdateRulesOrder() {

        let _RulesOrder: {
            [key: string]: number
        } = {}
        this.MiddlerRules.forEach(r => _RulesOrder[r.Id] = r.Order);

        var patchDocument = compare(this.RulesOrder, _RulesOrder);

        return this.http.patch<EndpointRule>(`/api/repo/litedb/order`, patchDocument, { headers: patchHeaders })
            .subscribe(_ => this.GetAll());
    }

    public SetRuleEnabled(rule: EndpointRule, value: boolean) {

        var orig = JSON.parse(JSON.stringify(rule))
        rule.Enabled = value;
        var patchDocument = compare(orig, rule)

        if (patchDocument.length > 0) {
            return this.http.patch<EndpointRule>(`/api/repo/litedb/${rule.Id}`, patchDocument, { headers: patchHeaders })
                .subscribe(rule => this.UpdatedMiddlerRule(rule));
        }

    }


    typings$: BehaviorSubject<DoobEditorFile[]> = new BehaviorSubject<DoobEditorFile[]>([]);

    public GetTypings() {
        this.message.Invoke<Array<{Key: string, Value: string}>>("MiddlerRule.GetTypings")
            .pipe(
                take(1),
                tap(typings => {
                    var ts = typings.map(t => new DoobEditorFile(t.Key, t.Value, false))
                    this.typings$.next(ts);
                })
            ).subscribe();
    }

}

