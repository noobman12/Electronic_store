import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DefaultLayouts from "./layouts/DefaultLayouts";
import { routesPage } from "./routes";
import LoginPage from "./pages/LoginPage";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

function App() {
  return (
    <>
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element= { <DefaultLayouts />}>
							{routesPage.map((route, index) => (
								<Route 
								key={index}
								path={route.path}
								element={route.element} 
								index={route.exact ? true : undefined}
								/>
							))}
						</Route>
						<Route path='/login' element= { <LoginPage />} />
					</Routes>
				</BrowserRouter>
			</HelmetProvider>
		</QueryClientProvider>
    </>
  );
}

export default App;
