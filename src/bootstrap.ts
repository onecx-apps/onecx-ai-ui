import { bootstrapModule } from '@onecx/angular-webcomponents';
import { environment } from 'src/environments/environment';
import { OnecxAiManagementUiModule } from './app/onecx-ai-management-ui-app.remote.module';

bootstrapModule(
  OnecxAiManagementUiModule,
  'microfrontend',
  environment.production
);
