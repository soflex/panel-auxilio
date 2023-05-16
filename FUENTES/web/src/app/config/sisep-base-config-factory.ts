import { SisepBaseConfig } from '@soflex/sisep-base';
import { ConfigService } from '../services/config.service';


export function SisepBaseConfigFactory(configService: ConfigService): SisepBaseConfig {
    const config: SisepBaseConfig = {
        data: configService.getAll()
    };
    return config;
}

