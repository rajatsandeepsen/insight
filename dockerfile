FROM zenika/alpine-chrome:with-puppeteer
USER chrome
COPY --chown=chrome:chrome package*.json ./
RUN npm install
COPY --chown=chrome:chrome . .
EXPOSE 3000
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]