
import { Href, useLocalSearchParams, useRouter } from 'expo-router';

type Screens = '/Profile' | '/Home' | '/Settings';

type NavigationParams = Record<
    string,
    string | number | boolean | (string | number)[] | null
>;

type NavigateOptions = {
    params?: NavigationParams;
    onNavigate?: () => void;
};

export const useNav = () => {
    const router = useRouter();
    const receivedParams = useLocalSearchParams();

    const to = (screen: Screens, options?: NavigateOptions) => {
        const { params, onNavigate } = options ?? {};

        if (params && Object.keys(params).length > 0) {
            const queryParams = Object.fromEntries(
                Object.entries(params).map(([key, value]) => [
                    key,
                    typeof value === 'boolean' ? String(value) : value,
                ])
            );

            router.push({
                pathname: screen,
                params: queryParams,
            } as unknown as Href);
        } else {
            router.push(screen as Href);
        }

        onNavigate?.();
    };

    const from = <T,>(callback: (params: T) => void) => {
        callback(receivedParams as T);
    };

    const back = () => router.back();

    return { to, from, back };
};


/*
    use like:

    // no params needed
    const nav = useNav();
    nav.to('/Home');


    <Buttons.Primary
        onPress={() => nav.to('/Settings')}
        label="Open Settings"
    />

    nav.to('/Machines', {
        params: {
            machine_id: 3,
        },
    });

    // then:
    const [machine, setMachine] = useState<Machine | null>(null);
    useEffect(() => {
        nav.from<{ machine_id?: string }>((params) => {
            if (params.machine_id) {
                fetchMachine(params.machine_id).then(setMachine);
            }
        });
    }, []);


    nav.to('/Settings', {
        onNavigate: () => {
            console.log('Navigation triggered');
        },
    });

*/