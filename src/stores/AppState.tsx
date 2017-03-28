import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import { ISubitem } from '../components/Subitem';

class AppState {
    @observable authenticated: boolean;
    @observable authenticating: boolean;
    @observable items: ISubitem[];
    @observable item: ISubitem;

    constructor() {
        this.authenticated = false;
        this.authenticating = false;
        this.items = [] as ISubitem[];
        this.item = {} as ISubitem;
    }

    @action fetchData = async (pathname: string) => {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com${pathname}`);
        console.log(data);
        /* required in strict mode to be allowed to update state: */
        runInAction('update state after fetching data', () => {
            data.length > 0 ? this.setData(data) : this.setSingle(data);
        })
    }

    setData(data: ISubitem[]) {
        this.items = data;
    }

    setSingle(data: any) {
        this.item = data;
    }

    /**
     *  This doesn't work ... don't know why yet.
     *  @action clearItems() {
     *       this.items = [] as ISubitem[];
     *       this.item = {} as ISubitem;
     *   }
     */
    @action clearItems = () => {
        this.items = [] as ISubitem[];
        this.item = {} as ISubitem;
    }

    @action authenticate = async () => {
        await new Promise((resolve) => {
            this.authenticating = true;
            setTimeout(() => {
                runInAction('update authentification states', () => {
                    this.authenticated = !this.authenticated;
                    this.authenticating = false;
                    resolve(this.authenticated);
                });
            }, 0);
        });
        // return { this.authenticated = true, authenticating: false }
    }

}

export default AppState;