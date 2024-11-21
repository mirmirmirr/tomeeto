# tomeeto

[tomeeto](http://tomeeto.cs.rpi.edu/) is a scheduling website that solves the logistics problem of figuring out when everyone is available to meet. Our goal was to simplify the process of communication with a simple and intuitive interface, where one person sends out a link to potential meeting times, and compiles the possible meeting times according to everyone’s availability.

The creation of this application was inspired by scheduling sites like [whenisgood](https://whenisgood.net/) and [when2meet](https://www.when2meet.com/) (except this one aims to provide a better user experience for users on both mobile and desktop devices).

## Usage

To use the application, just go to **http://tomeeto.cs.rpi.edu/** and start scheduling!

## Contributing

### Project Dependencies

**Frontend**

> **React:** 18.3.1
> <br>**TailwindCSS:** 3.4.14
> <br> **Vite:** 5.4.9
> <br> **Node.js:** 23.0.0

These and all required packages can be installed using `npm i` if you have React.

**Backend**

> **Python:** 3.11.1
> <br> **FastAPI:** 0.115.3

These and all required packages can be installed using `pip install -r backend/requirements.txt`.

**Database**

> **MySQL:** 8.0.39

### Code Structure

```
/tomeeto
    /backend
        the backend structure (mediator between frontend and database)
    /database
        db_setup.sql
    /public
    /src
        /assets
            images for used within the site
        /pages
            main pages of site
        /resources
            custom components
```

### Additional Notes

- You cannot commit directly to `main`, when developing, please create your own branch to work on.
- The repository is configured with formatting checks using `prettier` and `black` for React and python code, respectively. This is to ensure that the code is formatted well and meets coding standards. **You will not be able merge the branch until these tests pass.**
  - Run `npm run format` for React
  - Run `black --check .` for python
- Anyone who is not an explicitly invited collaborator cannot make branches or commit on the main repo. Instead, they have to fork the repo and the make a pull request through that.

## Contributors

Gavin Liu
<br>Daniel Shi
<br>Nick Wang
<br>Jack Zgombic
<br>Miranda Zheng
