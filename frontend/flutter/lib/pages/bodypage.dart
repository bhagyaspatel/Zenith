import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:zenith/pages/community_page.dart';
import 'package:zenith/pages/form_page.dart';
import 'package:zenith/pages/homepage.dart';

class body_page extends StatefulWidget {
  const body_page({super.key});

  @override
  State<body_page> createState() => _body_pageState();
}

class _body_pageState extends State<body_page> {
  int _selectedPage = 0;

  final _pageOptions = [
    const HomePage(),
    const Community(),
    const HomePage(),
    AddForm(),
    HomePage(),
  ];
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: _pageOptions[_selectedPage],
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(15), topRight: Radius.circular(15)),
            color: Colors.blue[800],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 5),
            child: GNav(
              // type: BottomNavigationBarType.fixed,
              backgroundColor: Colors.blue[800]!,
              color: Colors.white,
              activeColor: Colors.amberAccent,
              tabBackgroundColor: Colors.blue,
              selectedIndex: _selectedPage,
              padding: EdgeInsets.all(18),
              //textSize: 3,
              gap: 5,
              tabs: [
                GButton(
                  icon: Icons.leaderboard,
                  text: "Leader",
                ),
                GButton(
                  icon: Icons.chat,
                  text: "Community",
                ),
                GButton(
                  icon: Icons.home,
                  text: "Home",
                ),
                GButton(
                  icon: Icons.add,
                  text: "Add Task",
                ),
                GButton(
                  icon: Icons.person,
                  text: "Profile",
                ),
              ],
              onTabChange: (int index) {
                setState(() {
                  _selectedPage = index;
                });
              },
            ),
          ),
        ),
      ),
    );
  }
}
