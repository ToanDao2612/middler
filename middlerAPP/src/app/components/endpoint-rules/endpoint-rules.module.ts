import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointRulesRoutingModule, RoutingComponents } from './endpoint-rules-routing.module';
import { EndpointRulesListComponent } from './endpoint-rules-list/endpoint-rules-list.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { EndpointActionsListComponent } from './endpoint-actions-list/endpoint-actions-list.component';
import { ActionListDetailsComponent } from './endpoint-actions-list/action-list-details/action-list-details.component';
import { ActionBasicModalComponent } from './endpoint-actions/base/action-basic-modal.component';
import { UrlRewriteModalComponent, UrlRedirectModalComponent, ProxyModalComponent, ScriptModalComponent } from './endpoint-actions';
import { DoobEditorModule } from '@doob-ng/editor';
import { DoobCoreModule } from '@doob-ng/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const ActionComponents = [
    ActionBasicModalComponent,
    UrlRewriteModalComponent, UrlRedirectModalComponent, ProxyModalComponent, ScriptModalComponent
]

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EndpointRulesRoutingModule,
        DragDropModule,
        FontAwesomeModule,
        IconsProviderModule,
        NzMenuModule,
        NzDropDownModule,
        NzTabsModule,
        NzGridModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzInputNumberModule,
        NzCheckboxModule,
        NzSelectModule,
        NzCollapseModule,
        DoobEditorModule,
        DoobCoreModule,
        NzToolTipModule
    ],
    declarations: [
        ...RoutingComponents,
        ...ActionComponents,
        EndpointRulesListComponent,
        EndpointActionsListComponent,
        ActionListDetailsComponent
    ],
    entryComponents: [
        ...ActionComponents,
    ]
    
})
export class EndpointRulesModule { }
