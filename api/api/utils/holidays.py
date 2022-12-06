import datetime

class Holidays:
    
    EASTER_JULIAN = 1
    EASTER_ORTHODOX = 2
    EASTER_WESTERN = 3

    def BcStats(self, year):
        return {
            "Year" : str(year),
            "NewYearsDay" : self.NewYearsDay(year).strftime("%Y-%m-%d"),
            "BcFamilyDay" : self.FamilyDay(year).strftime("%Y-%m-%d"),
            "GoodFriday" : self.GoodFriday(year).strftime("%Y-%m-%d"),
            "EasterMonday" : self.EasterMonday(year).strftime("%Y-%m-%d"),
            "VictoriaDay" : self.VictoriaDay(year).strftime("%Y-%m-%d"),
            "CanadaDay" : self.CanadaDay(year).strftime("%Y-%m-%d"),
            "BcDay" : self.BcDay(year).strftime("%Y-%m-%d"),
            "LabourDay" : self.LabourDay(year).strftime("%Y-%m-%d"),
            "TruthAndReconciliationDay" : self.TruthReconciliationDay(year).strftime("%Y-%m-%d"),
            "Thanksgiving" : self.Thanksgiving(year).strftime("%Y-%m-%d"),
            "RemembranceDay" : self.RemembranceDay(year).strftime("%Y-%m-%d"),
            "ChristmasDay" : self.ChristmasDay(year).strftime("%Y-%m-%d"),
            "BoxingDay" : self.BoxingDay(year).strftime("%Y-%m-%d"),
            "NextYearNewYearsDay" : self.NewYearsDay(year + 1).strftime("%Y-%m-%d"),
        }
        
    # New Year Holiday
    def NewYearsDay(self, year):
        return self.DateOrFollowingMonday(year, 1, 1)

    # BC Family Day
    # second Monday in February
    def FamilyDay(self, year):
        return self.NthMonday(year, 2, 3)
    
    # Good Friday
    def GoodFriday(self, year):
        return self.EasterSunday(year) + datetime.timedelta(days=-2) 

    # Easter Monday
    def EasterMonday(self, year):
        return self.EasterSunday(year) + datetime.timedelta(days=1)

    #Victoria Day
    #Monday before May 25.  (18th - 24th)
    def VictoriaDay(self, year):
        
        victoriaDay = datetime.datetime(year, 5, 18)

        while (victoriaDay.weekday() != 0): # victoriaDay.weekday() != DayOfWeek.Monday):       
            victoriaDay = victoriaDay + datetime.timedelta(days=1)

        return victoriaDay

    #Canada Day
    #July 1st or the follwing monday of July 1 falls on a weekend
    def CanadaDay(self, year):
        return self.DateOrFollowingMonday(year, 7, 1);
        
    #BC Day
    #1st Monday in August
    def BcDay(self, year):        
        return self.NthMonday(year, 8, 1)
        
    #Labour Day
    #1st Monday in September
    def LabourDay(self, year):
        return self.NthMonday(year, 9, 1)

    #Truth and Reconciliation Day
    #Sep 30 or the following Monday if Sep 30th falls on a weekend 
    def TruthReconciliationDay(self, year):
        return self.DateOrFollowingMonday(year, 9, 30)
    
    #Thanksgiving
    #2nd Monday in October
    def Thanksgiving(self, year):
        return self.NthMonday(year, 10, 2)

    #Remembrance Day
    #Nov 11 or the following Monday if Nov 11th falls on a weekend
    def RemembranceDay(self, year):
        return self.DateOrFollowingMonday(year, 11, 11)

    #Christmas Day
    #Dec 25 or the following Monday if Dec 25th falls on a weekend
    def ChristmasDay(self, year):
        return self.DateOrFollowingMonday(year, 12, 25)

    #Boxing Day
    #Dec 26 or the following monday or tuesday
    def BoxingDay(self, year):

        boxingDay = datetime.datetime(year, 12, 26)

        if boxingDay.weekday() == 5 : # DayOfWeek.Saturday:
                return boxingDay + datetime.timedelta(days=2)
        elif boxingDay.weekday() == 6 : # DayOfWeek.Sunday:
                return boxingDay + datetime.timedelta(days=2)
        elif boxingDay.weekday() == 0 : # DayOfWeek.Monday:
                return boxingDay + datetime.timedelta(days=1)
        else:
            return boxingDay
      

    def EasterSunday(self, year, method=EASTER_WESTERN):
        
        # dateutil package:

        # This method was ported from the work done by GM Arts,
        # on top of the algorithm by Claus Tondering, which was
        # based in part on the algorithm of Ouding (1940), as
        # quoted in "Explanatory Supplement to the Astronomical
        # Almanac", P.  Kenneth Seidelmann, editor.

        # More about the algorithm may be found at:
        #`GM Arts: Easter Algorithms <http://www.gmarts.org/index.php?go=415>`_
        #`The Calendar FAQ: Easter <https://www.tondering.dk/claus/cal/easter.php>`_

        # g - Golden year - 1
        # c - Century
        # h - (23 - Epact) mod 30
        # i - Number of days from March 21 to Paschal Full Moon
        # j - Weekday for PFM (0=Sunday, etc)
        # p - Number of days from March 21 to Sunday on or before PFM
        #     (-6 to 28 methods 1 & 3, to 56 for method 2)
        # e - Extra days to add for method 2 (converting Julian
        #     date to Gregorian date)

        y = year
        g = y % 19
        e = 0
        if method < 3:
            # Old method
            i = (19*g + 15) % 30
            j = (y + y//4 + i) % 7
            if method == 2:
                # Extra dates to convert Julian to Gregorian date
                e = 10
                if y > 1600:
                    e = e + y//100 - 16 - (y//100 - 16)//4
        else:
            # New method
            c = y//100
            h = (c - c//4 - (8*c + 13)//25 + 19*g + 15) % 30
            i = h - (h//28)*(1 - (h//28)*(29//(h + 1))*((21 - g)//11))
            j = (y + y//4 + i + 2 - c + c//4) % 7

        # p can be from -6 to 56 corresponding to dates 22 March to 23 May
        # (later dates apply to method 2, although 23 May never actually occurs)
        p = i - j + e
        d = 1 + (p + 27 + (p + 6)//40) % 31
        m = 3 + (p + 26)//30
        return datetime.date(int(y), int(m), int(d))


    def NthMonday(self, year, month, nth):
    
        first = datetime.datetime(year, month, 1)

        while (first.weekday() != 0): # first.weekday() != DayOfWeek.Monday):
            first = first + datetime.timedelta(days=1)
        
        adding_days = 7*(nth - 1) # .AddDays(7*(nth - 1)
        return first + datetime.timedelta(days=adding_days)
    

    def DateOrFollowingMonday(self, year, month, day):

        specificDate = datetime.datetime(year, month, day)
        weekday = specificDate.weekday()

        if weekday == 5:         # DayOfWeek.Saturday
            return specificDate + datetime.timedelta(days=2)
        elif weekday == 6:       # DayOfWeek.Sunday
            return specificDate + datetime.timedelta(days=1)
        else:
            return specificDate
        
    