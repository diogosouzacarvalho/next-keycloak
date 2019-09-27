/*
 * @author: JP Lew (jp@cto.ai)
 * @date: Friday, 2nd August 2019 2:23:51 pm
 * @lastModifiedBy: JP Lew (jp@cto.ai)
 * @lastModifiedTime: Thursday, 26th September 2019 4:23:49 pm
 * @copyright (c) 2019 CTO.ai
 */

import Link from "next/link"
import { FC, useEffect } from "react"

import { useKeycloakContext, useServerContext } from "../utils/context"
import { setCookie } from "../utils/cookies"

export const Header: FC = () => {
  const { keycloak, keycloakInitialized } = useKeycloakContext()
  const { isServer, isAuthenticated, setIsAuthenticated } = useServerContext()
  // console.log("login url", keycloak.createLoginUrl())
  /*
   * The purpose of this hook is to synchronize the Keycloak authentication
   * status with our custom cookie status (isAuthenticated).
   * keycloak.authenticated is authoritative, isAuthenticated is dependent.
   * Note: this is only refreshing state in our ServerContext Provider, it is
   * not setting the cookie. The cookie is being set in the onReady event in
   * utils/keycloak.ts.
   *
   * The reason we put this in the Header component (as opposed to the _app
   * template) is because Header is nested inside both our providers:
   * ServerContext and KeycloakContext.
   */
  useEffect(() => {
    const isKeycloakAuthenticated = keycloak.authenticated ? "true" : "false"
    if (keycloakInitialized && isKeycloakAuthenticated !== isAuthenticated) {
      setIsAuthenticated(isKeycloakAuthenticated)
    }
  })

  return (
    <header className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <Link href="/">
        <a className="my-0 mr-md-auto font-weight-bold text-dark">
          Next.js + Keycloak
        </a>
      </Link>
      <nav className="my-2 my-md-0 mr-md-3">
        <Link href="/profile">
          <a className="p-2 text-dark">Profile</a>
        </Link>
        <Link href={{ pathname: "/posts" }}>
          <a className="p-2 text-dark">Posts</a>
        </Link>
      </nav>
      {// either the client (keycloak.authenticated) or the server (isAuthenticated cookie) has to assert that the user is logged in
      keycloak.authenticated || (isServer && isAuthenticated === "true") ? (
        <>
          <button
            type="button"
            className="mx-2 btn btn-outline-primary"
            onClick={() => {
              setCookie("isAuthenticated", "false")
              window.location.href = keycloak.createLogoutUrl()
            }}
          >
            Logout
          </button>
          <button
            type="button"
            className="mx-2 btn btn-outline-primary"
            onClick={() => (window.location.href = keycloak.createAccountUrl())}
          >
            My Account
          </button>
        </>
      ) : (
        <>
          <a
            className="m-2 btn btn-outline-primary"
            onClick={() =>
              (window.location.href = keycloak.createRegisterUrl())
            }
          >
            Signup
          </a>
          <a
            className="m-2 btn btn-outline-primary"
            onClick={() => {
              console.log("login url", keycloak.createLoginUrl())
              console.log("account url", keycloak.createAccountUrl())
              console.log("register url", keycloak.createRegisterUrl())
              // keycloak.login()
              // keycloak.accountManagement()
              // window.location.href = keycloak.createLoginUrl()
            }}
          >
            Login
          </a>
        </>
      )}
    </header>
    // <header>
    //   <nav>
    //     <Link href="/">
    //       <a>Home</a>
    //     </Link>{' '}
    //     |{' '}
    //     <Link href="/about">
    //       <a>About</a>
    //     </Link>{' '}
    //     |{' '}
    //     <Link href="/initial-props">
    //       <a>With Initial Props</a>
    //     </Link>
    //   </nav>
    // </header>
  )
}