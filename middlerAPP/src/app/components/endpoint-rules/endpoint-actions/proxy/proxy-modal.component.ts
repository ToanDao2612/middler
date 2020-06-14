import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayContext } from '@doob-ng/cdk-helper';
import { EndpointAction } from '../../models/endpoint-action';

@Component({
    templateUrl: './proxy-modal.component.html',
    styleUrls: ['./proxy-modal.component.scss']
})
export class ProxyModalComponent implements OnInit {



    form: FormGroup;

    constructor(private fb: FormBuilder,
        private context: OverlayContext<EndpointAction>) {

    }

    ngOnInit() {

        this.form = this.fb.group({
            DestinationUrl: [],
            UserIntermediateStream: [],
            AddXForwardedHeaders: [],
            CopyXForwardedHeaders: []
        });

        this.form.patchValue(this.context.data.Parameters)
    }

    ok() {
        this.context.invoke("OK", this.form.value);
    }

    cancel() {
        this.context.handle.Close();
    }

}
